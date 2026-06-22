const supabaseUrl = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || "";
const secretKey = process.env.SUPABASE_SECRET_KEY || "";
const accessCookie = "atwix_access";
const refreshCookie = "atwix_refresh";

export function isAccountBackendConfigured() {
  return Boolean(supabaseUrl && publishableKey && secretKey);
}

export async function handleAccountApi(req, res, url, helpers) {
  const { readJson, sendJson, getPublicOrigin, httpError } = helpers;

  if (!isAccountBackendConfigured()) throw httpError(503, "Account service is not configured yet.");

  if (req.method === "GET" && url.pathname === "/api/auth/session") {
    const account = await readAccountFromRequest(req, res, false);
    sendJson(res, 200, { account });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/signup") {
    const body = await readJson(req);
    const email = normalizeEmail(body.email);
    const password = normalizePassword(body.password);
    const displayName = normalizeDisplayName(body.displayName);
    const existingProfile = await serviceRequest(`/rest/v1/profiles?normalized_display_name=eq.${encodeURIComponent(displayName.toLowerCase())}&select=id&limit=1`);
    if (existingProfile.length) throw accountError(409, "That display name is already taken.");
    const redirectTo = buildAuthRedirect(req, getPublicOrigin, body.returnTo, "confirmed");
    const result = await authRequest(`/signup?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: "POST",
      body: { email, password, data: { display_name: displayName } }
    });
    if (result.access_token && result.refresh_token) setSessionCookies(res, result);
    sendJson(res, 201, {
      account: result.access_token ? await accountFromAccessToken(result.access_token) : null,
      confirmationRequired: !result.access_token,
      message: result.access_token ? "Account created." : "Check your email to confirm your account."
    });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    const body = await readJson(req);
    const result = await authRequest("/token?grant_type=password", {
      method: "POST",
      body: { email: normalizeEmail(body.email), password: String(body.password || "") }
    });
    setSessionCookies(res, result);
    sendJson(res, 200, { account: await accountFromAccessToken(result.access_token) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/exchange") {
    const body = await readJson(req);
    const accessToken = String(body.accessToken || "");
    const refreshToken = String(body.refreshToken || "");
    if (!accessToken || !refreshToken) throw httpError(400, "The email link is incomplete. Request a fresh one.");
    const user = await readAuthUser(accessToken);
    setSessionCookies(res, { access_token: accessToken, refresh_token: refreshToken, expires_in: 3600 });
    sendJson(res, 200, { account: await accountFromUser(user) });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/recover") {
    const body = await readJson(req);
    const redirectTo = buildAuthRedirect(req, getPublicOrigin, body.returnTo, "reset");
    await authRequest(`/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: "POST",
      body: { email: normalizeEmail(body.email) }
    });
    sendJson(res, 200, { message: "If that email has an account, a reset link is on its way." });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/password") {
    const session = await readSession(req, res, true);
    const body = await readJson(req);
    const password = normalizePassword(body.password);
    await authRequest("/user", {
      method: "PUT",
      accessToken: session.accessToken,
      body: { password }
    });
    sendJson(res, 200, { message: "Password updated." });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/logout") {
    const session = await readSession(req, res, false);
    if (session?.accessToken) {
      await authRequest("/logout", { method: "POST", accessToken: session.accessToken }).catch(() => {});
    }
    clearSessionCookies(res);
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/account") {
    const account = await readAccountFromRequest(req, res, true);
    const rivalries = await getAccountRivalries(account.id);
    sendJson(res, 200, { account, rivalries });
    return true;
  }

  return false;
}

export async function requireAccount(req, res) {
  return readAccountFromRequest(req, res, true);
}

export async function getRoomRivalries(accountIds) {
  const ids = [...new Set(accountIds.filter(Boolean))];
  if (ids.length < 2 || !isAccountBackendConfigured()) return [];
  const rows = await serviceRequest(`/rest/v1/rivalry_details?select=*&or=(account_low.in.(${ids.join(",")}),account_high.in.(${ids.join(",")}))`);
  const idSet = new Set(ids);
  return rows
    .filter((row) => idSet.has(row.account_low) && idSet.has(row.account_high))
    .map(publicRivalry);
}

export async function recordCompletedRoom(room) {
  if (!isAccountBackendConfigured() || room.historySaved) return;
  const leaderboard = room.lastLeaderboard || [];
  if (leaderboard.length < 2) return;
  await serviceRequest("/rest/v1/rpc/record_completed_match", {
    method: "POST",
    body: {
      p_external_room_id: room.id,
      p_room_code: room.code,
      p_game_mode: room.settings.gameMode || "Classic",
      p_players: leaderboard.map((entry) => ({
        accountId: entry.playerId,
        rank: entry.rank,
        totalPoints: entry.totalPoints,
        correctAnswers: entry.correctAnswers
      }))
    }
  });
  room.historySaved = true;
}

async function readAccountFromRequest(req, res, required) {
  const session = await readSession(req, res, required);
  if (!session) return null;
  return accountFromUser(session.user);
}

async function readSession(req, res, required) {
  const cookies = parseCookies(req.headers.cookie || "");
  const accessToken = cookies[accessCookie] || "";
  const refreshToken = cookies[refreshCookie] || "";

  if (accessToken) {
    try {
      return { accessToken, refreshToken, user: await readAuthUser(accessToken) };
    } catch {
      // Refresh below.
    }
  }

  if (refreshToken) {
    try {
      const refreshed = await authRequest("/token?grant_type=refresh_token", {
        method: "POST",
        body: { refresh_token: refreshToken }
      });
      setSessionCookies(res, refreshed);
      return {
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token,
        user: refreshed.user || await readAuthUser(refreshed.access_token)
      };
    } catch {
      clearSessionCookies(res);
    }
  }

  if (required) {
    const error = new Error("Sign in to play Atwix Trivia.");
    error.status = 401;
    throw error;
  }
  return null;
}

async function accountFromAccessToken(accessToken) {
  return accountFromUser(await readAuthUser(accessToken));
}

async function accountFromUser(user) {
  const profiles = await serviceRequest(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=*`);
  const profile = profiles[0];
  if (!profile) throw new Error("Account profile is missing. Please contact the host.");
  return {
    id: profile.id,
    email: profile.email,
    displayName: profile.display_name,
    totalGames: profile.total_games,
    totalWins: profile.total_wins,
    totalLosses: profile.total_losses,
    totalDraws: profile.total_draws,
    classicWins: profile.classic_wins,
    geniusWins: profile.genius_wins,
    emailConfirmed: Boolean(user.email_confirmed_at || user.confirmed_at)
  };
}

async function getAccountRivalries(accountId) {
  const rows = await serviceRequest(`/rest/v1/rivalry_details?select=*&or=(account_low.eq.${accountId},account_high.eq.${accountId})&order=last_played_at.desc`);
  return rows.map(publicRivalry);
}

function publicRivalry(row) {
  return {
    accountLow: row.account_low,
    lowName: row.low_name,
    accountHigh: row.account_high,
    highName: row.high_name,
    lowWins: row.low_wins,
    highWins: row.high_wins,
    draws: row.draws,
    lastWinnerId: row.last_winner_id,
    lastPlayedAt: row.last_played_at,
    streakWinnerId: row.streak_winner_id,
    streakCount: row.streak_count
  };
}

async function readAuthUser(accessToken) {
  return authRequest("/user", { method: "GET", accessToken });
}

async function authRequest(path, options = {}) {
  const response = await fetch(`${supabaseUrl}/auth/v1${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: publishableKey,
      "Content-Type": "application/json",
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(friendlyAuthError(payload));
    error.status = response.status === 400 ? 400 : response.status;
    throw error;
  }
  return payload;
}

async function serviceRequest(path, options = {}) {
  const authorization = secretKey.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${secretKey}` };
  const response = await fetch(`${supabaseUrl}${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: secretKey,
      ...authorization,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.message || payload?.hint || "History database did not respond.");
    error.status = 502;
    throw error;
  }
  return payload;
}

function setSessionCookies(res, session) {
  const secure = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);
  const base = `HttpOnly; Path=/; SameSite=Lax${secure ? "; Secure" : ""}`;
  const accessAge = Math.max(60, Number(session.expires_in || 3600));
  res.setHeader("Set-Cookie", [
    `${accessCookie}=${encodeURIComponent(session.access_token)}; Max-Age=${accessAge}; ${base}`,
    `${refreshCookie}=${encodeURIComponent(session.refresh_token)}; Max-Age=${60 * 60 * 24 * 60}; ${base}`
  ]);
}

function clearSessionCookies(res) {
  res.setHeader("Set-Cookie", [
    `${accessCookie}=; Max-Age=0; HttpOnly; Path=/; SameSite=Lax`,
    `${refreshCookie}=; Max-Age=0; HttpOnly; Path=/; SameSite=Lax`
  ]);
}

function parseCookies(value) {
  return Object.fromEntries(String(value).split(";").map((part) => part.trim()).filter(Boolean).map((part) => {
    const index = part.indexOf("=");
    return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
  }));
}

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error("Enter a valid email address.");
    error.status = 400;
    throw error;
  }
  return email;
}

function normalizePassword(value) {
  const password = String(value || "");
  if (password.length < 8) {
    const error = new Error("Use at least 8 characters for your password.");
    error.status = 400;
    throw error;
  }
  return password;
}

function normalizeDisplayName(value) {
  const name = String(value || "").trim().replace(/\s+/g, " ").slice(0, 28);
  if (name.length < 2) {
    const error = new Error("Display names need at least 2 characters.");
    error.status = 400;
    throw error;
  }
  return name;
}

function buildAuthRedirect(req, getPublicOrigin, returnTo, authMode) {
  const origin = getPublicOrigin(req);
  const target = new URL(normalizeReturnTo(returnTo), origin);
  target.searchParams.set("auth", authMode);
  return target.toString();
}

function normalizeReturnTo(value) {
  const candidate = String(value || "/").trim();
  if (!candidate.startsWith("/") || candidate.startsWith("//")) return "/";
  try {
    const parsed = new URL(candidate, "https://atwix.local");
    if (parsed.origin !== "https://atwix.local") return "/";
    parsed.hash = "";
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return "/";
  }
}

function accountError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function friendlyAuthError(payload) {
  const message = String(payload?.msg || payload?.message || payload?.error_description || payload?.error || "Authentication failed.");
  if (/invalid login credentials/i.test(message)) return "Email or password is incorrect.";
  if (/user already registered/i.test(message)) return "That email already has an account. Sign in instead.";
  if (/duplicate key.*display_name|profiles_display_name_unique/i.test(message)) return "That display name is already taken.";
  if (/email not confirmed/i.test(message)) return "Confirm your email before signing in.";
  return message;
}
