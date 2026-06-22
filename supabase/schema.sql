create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null check (char_length(trim(display_name)) between 2 and 28),
  normalized_display_name text generated always as (lower(trim(display_name))) stored,
  total_games integer not null default 0 check (total_games >= 0),
  total_wins integer not null default 0 check (total_wins >= 0),
  total_losses integer not null default 0 check (total_losses >= 0),
  total_draws integer not null default 0 check (total_draws >= 0),
  classic_wins integer not null default 0 check (classic_wins >= 0),
  genius_wins integer not null default 0 check (genius_wins >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_display_name_unique
  on public.profiles (normalized_display_name);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  external_room_id text not null unique,
  room_code text not null,
  game_mode text not null check (game_mode in ('Classic', 'Genius')),
  completed_at timestamptz not null default now()
);

create table if not exists public.match_players (
  match_id uuid not null references public.matches(id) on delete cascade,
  account_id uuid not null references public.profiles(id) on delete cascade,
  final_rank integer not null check (final_rank > 0),
  total_points integer not null default 0,
  correct_answers integer not null default 0,
  primary key (match_id, account_id)
);

create index if not exists match_players_account_index
  on public.match_players (account_id, match_id);

create table if not exists public.rivalry_records (
  account_low uuid not null references public.profiles(id) on delete cascade,
  account_high uuid not null references public.profiles(id) on delete cascade,
  low_wins integer not null default 0 check (low_wins >= 0),
  high_wins integer not null default 0 check (high_wins >= 0),
  draws integer not null default 0 check (draws >= 0),
  last_winner_id uuid references public.profiles(id) on delete set null,
  last_played_at timestamptz,
  streak_winner_id uuid references public.profiles(id) on delete set null,
  streak_count integer not null default 0 check (streak_count >= 0),
  primary key (account_low, account_high),
  check (account_low < account_high)
);

alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.match_players enable row level security;
alter table public.rivalry_records enable row level security;

revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to service_role;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_name text;
begin
  requested_name := trim(coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  if char_length(requested_name) < 2 then
    requested_name := left(split_part(new.email, '@', 1), 28);
  end if;

  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, requested_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.record_completed_match(
  p_external_room_id text,
  p_room_code text,
  p_game_mode text,
  p_players jsonb
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_match_id uuid;
  v_winner_count integer;
  v_player jsonb;
  v_left jsonb;
  v_right jsonb;
  v_low uuid;
  v_high uuid;
  v_winner uuid;
  v_existing public.rivalry_records%rowtype;
begin
  insert into public.matches (external_room_id, room_code, game_mode)
  values (p_external_room_id, p_room_code, p_game_mode)
  on conflict (external_room_id) do nothing
  returning id into v_match_id;

  if v_match_id is null then
    select id into v_match_id from public.matches where external_room_id = p_external_room_id;
    return v_match_id;
  end if;

  select count(*) into v_winner_count
  from jsonb_array_elements(p_players) player
  where (player ->> 'rank')::integer = 1;

  for v_player in select * from jsonb_array_elements(p_players)
  loop
    insert into public.match_players (match_id, account_id, final_rank, total_points, correct_answers)
    values (
      v_match_id,
      (v_player ->> 'accountId')::uuid,
      (v_player ->> 'rank')::integer,
      coalesce((v_player ->> 'totalPoints')::integer, 0),
      coalesce((v_player ->> 'correctAnswers')::integer, 0)
    );

    update public.profiles
    set
      total_games = total_games + 1,
      total_wins = total_wins + case when (v_player ->> 'rank')::integer = 1 and v_winner_count = 1 then 1 else 0 end,
      total_draws = total_draws + case when (v_player ->> 'rank')::integer = 1 and v_winner_count > 1 then 1 else 0 end,
      total_losses = total_losses + case when (v_player ->> 'rank')::integer > 1 then 1 else 0 end,
      classic_wins = classic_wins + case when p_game_mode = 'Classic' and (v_player ->> 'rank')::integer = 1 and v_winner_count = 1 then 1 else 0 end,
      genius_wins = genius_wins + case when p_game_mode = 'Genius' and (v_player ->> 'rank')::integer = 1 and v_winner_count = 1 then 1 else 0 end,
      updated_at = now()
    where id = (v_player ->> 'accountId')::uuid;
  end loop;

  for v_left, v_right in
    select left_player, right_player
    from jsonb_array_elements(p_players) with ordinality as l(left_player, left_index)
    join jsonb_array_elements(p_players) with ordinality as r(right_player, right_index)
      on l.left_index < r.right_index
  loop
    v_low := least((v_left ->> 'accountId')::uuid, (v_right ->> 'accountId')::uuid);
    v_high := greatest((v_left ->> 'accountId')::uuid, (v_right ->> 'accountId')::uuid);

    if (v_left ->> 'rank')::integer = (v_right ->> 'rank')::integer then
      v_winner := null;
    elsif (v_left ->> 'rank')::integer < (v_right ->> 'rank')::integer then
      v_winner := (v_left ->> 'accountId')::uuid;
    else
      v_winner := (v_right ->> 'accountId')::uuid;
    end if;

    select * into v_existing
    from public.rivalry_records
    where account_low = v_low and account_high = v_high;

    insert into public.rivalry_records (
      account_low, account_high, low_wins, high_wins, draws,
      last_winner_id, last_played_at, streak_winner_id, streak_count
    ) values (
      v_low,
      v_high,
      case when v_winner = v_low then 1 else 0 end,
      case when v_winner = v_high then 1 else 0 end,
      case when v_winner is null then 1 else 0 end,
      v_winner,
      now(),
      v_winner,
      case when v_winner is null then 0 else 1 end
    )
    on conflict (account_low, account_high) do update set
      low_wins = public.rivalry_records.low_wins + case when v_winner = v_low then 1 else 0 end,
      high_wins = public.rivalry_records.high_wins + case when v_winner = v_high then 1 else 0 end,
      draws = public.rivalry_records.draws + case when v_winner is null then 1 else 0 end,
      last_winner_id = v_winner,
      last_played_at = now(),
      streak_winner_id = case when v_winner is null then null else v_winner end,
      streak_count = case
        when v_winner is null then 0
        when v_existing.streak_winner_id = v_winner then v_existing.streak_count + 1
        else 1
      end;
  end loop;

  return v_match_id;
end;
$$;

revoke all on function public.record_completed_match(text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.record_completed_match(text, text, text, jsonb) to service_role;

create or replace view public.rivalry_details as
select
  r.account_low,
  low_profile.display_name as low_name,
  r.account_high,
  high_profile.display_name as high_name,
  r.low_wins,
  r.high_wins,
  r.draws,
  r.last_winner_id,
  r.last_played_at,
  r.streak_winner_id,
  r.streak_count
from public.rivalry_records r
join public.profiles low_profile on low_profile.id = r.account_low
join public.profiles high_profile on high_profile.id = r.account_high;

revoke all on public.rivalry_details from public, anon, authenticated;
grant select on public.rivalry_details to service_role;
