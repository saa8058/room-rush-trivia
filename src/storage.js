const TAB_PLAYER_PREFIX = "room-rush-player:";

export const partyLines = [
  "Leaderboard drama incoming.",
  "Protect your streak.",
  "Fast fingers, big points.",
  "No pressure, but everyone is watching.",
  "Wrong answers build character.",
  "The group chat will remember this."
];

export async function createRoom(displayName) {
  const result = await api("/api/rooms", {
    method: "POST",
    body: { displayName }
  });
  setTabPlayerId(result.room.code, result.player.id);
  return result;
}

export async function joinRoom(codeInput, displayName, playerId = null) {
  const code = normalizeCode(codeInput);
  const result = await api(`/api/rooms/${code}/join`, {
    method: "POST",
    body: { displayName, playerId }
  });
  setTabPlayerId(result.room.code, result.player.id);
  return result;
}

export async function readRoom(codeInput) {
  const code = normalizeCode(codeInput);
  if (!code) return null;
  try {
    return (await api(`/api/rooms/${code}`)).room;
  } catch {
    return null;
  }
}

export async function updateSettings(code, playerId, settings) {
  return (await api(`/api/rooms/${normalizeCode(code)}/settings`, {
    method: "POST",
    body: { playerId, settings }
  })).room;
}

export async function startGame(code, playerId) {
  return (await api(`/api/rooms/${normalizeCode(code)}/start`, {
    method: "POST",
    body: { playerId }
  })).room;
}

export async function submitAnswer(code, playerId, choiceIndex) {
  return (await api(`/api/rooms/${normalizeCode(code)}/answer`, {
    method: "POST",
    body: { playerId, choiceIndex }
  })).room;
}

export async function tickRoom(code) {
  return (await api(`/api/rooms/${normalizeCode(code)}/tick`, { method: "POST" })).room;
}

export async function showLeaderboard(code, playerId) {
  return (await api(`/api/rooms/${normalizeCode(code)}/show-leaderboard`, {
    method: "POST",
    body: { playerId }
  })).room;
}

export async function nextQuestion(code, playerId) {
  return (await api(`/api/rooms/${normalizeCode(code)}/next`, {
    method: "POST",
    body: { playerId }
  })).room;
}

export async function playAgain(code, playerId) {
  return (await api(`/api/rooms/${normalizeCode(code)}/play-again`, {
    method: "POST",
    body: { playerId }
  })).room;
}

export function subscribeToRoom(code, callback) {
  const normalized = normalizeCode(code);
  if (!("EventSource" in window)) return () => {};

  const source = new EventSource(`/api/rooms/${normalized}/events`);
  source.addEventListener("room", (event) => callback(JSON.parse(event.data)));
  source.onerror = () => {};
  return () => source.close();
}

export function recoverPlayer(room, preferredPlayerId = null) {
  if (!room) return null;
  if (preferredPlayerId) {
    const preferred = room.players.find((player) => player.id === preferredPlayerId);
    if (preferred) return preferred;
  }
  const id = getTabPlayerId(room.code);
  return room.players.find((player) => player.id === id) || null;
}

export function getCurrentQuestionId(room) {
  return room?.selectedQuestionIds?.[room.currentRoundIndex] || null;
}

export function getCurrentAnswer(room, playerId) {
  const questionId = getCurrentQuestionId(room);
  return questionId ? room.answers?.[questionId]?.[playerId] || null : null;
}

export function getRoundResult(room) {
  return room?.roundResults?.[room.currentRoundIndex] || null;
}

export function getPlayerResult(room, playerId) {
  return getRoundResult(room)?.playerResults?.find((result) => result.playerId === playerId) || null;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "The room server did not respond.");
  return payload;
}

function normalizeCode(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
}

function getTabPlayerId(code) {
  return sessionStorage.getItem(`${TAB_PLAYER_PREFIX}${code}`);
}

function setTabPlayerId(code, playerId) {
  sessionStorage.setItem(`${TAB_PLAYER_PREFIX}${code}`, playerId);
}
