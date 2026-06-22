const TAB_PLAYER_PREFIX = "room-rush-player:";
const SAVED_PLAYER_PREFIX = "atwix-player:";
const LAST_ROOM_KEY = "atwix-last-room";

export const partyLines = [
  "Leaderboard drama incoming.",
  "Protect your streak.",
  "Fast fingers, big points.",
  "No pressure, but everyone is watching.",
  "Wrong answers build character.",
  "The group chat will remember this."
];

export async function createRoom() {
  const result = await api("/api/rooms", {
    method: "POST"
  });
  setTabPlayerId(result.room.code, result.player.id);
  return result;
}

export async function joinRoom(codeInput) {
  const code = normalizeCode(codeInput);
  const result = await api(`/api/rooms/${code}/join`, {
    method: "POST"
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

export async function setLobbyReady(code, playerId, ready) {
  return (await api(`/api/rooms/${normalizeCode(code)}/lobby-ready`, {
    method: "POST",
    body: { playerId, ready }
  })).room;
}

export async function transferHost(code, playerId, targetPlayerId = playerId) {
  return (await api(`/api/rooms/${normalizeCode(code)}/transfer-host`, {
    method: "POST",
    body: { playerId, targetPlayerId }
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

export async function reportQuestion(code, playerId, questionId, reason) {
  return (await api(`/api/rooms/${normalizeCode(code)}/report-question`, {
    method: "POST",
    body: { playerId, questionId, reason }
  })).room;
}

export async function leaveRoom(code, playerId) {
  const normalized = normalizeCode(code);
  const room = (await api(
    "/api/rooms/" + normalized + "/leave",
    {
      method: "POST",
      body: { playerId }
    }
  )).room;
  clearSavedPlayerId(normalized);
  return room;
}

export async function playAgain(code, playerId) {
  return (await api(`/api/rooms/${normalizeCode(code)}/play-again`, {
    method: "POST",
    body: { playerId }
  })).room;
}

export function subscribeToRoom(code, playerId, callback, onStatus = () => {}) {
  const normalized = normalizeCode(code);
  if (!("EventSource" in window)) return () => {};

  const query = playerId ? `?player=${encodeURIComponent(playerId)}` : "";
  const source = new EventSource(`/api/rooms/${normalized}/events${query}`);
  source.onopen = () => onStatus("live");
  source.addEventListener("room", (event) => callback(JSON.parse(event.data)));
  source.onerror = () => onStatus("reconnecting");
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
  return sessionStorage.getItem(`${TAB_PLAYER_PREFIX}${code}`) || localStorage.getItem(`${SAVED_PLAYER_PREFIX}${code}`);
}

function setTabPlayerId(code, playerId) {
  sessionStorage.setItem(`${TAB_PLAYER_PREFIX}${code}`, playerId);
  localStorage.setItem(`${SAVED_PLAYER_PREFIX}${code}`, playerId);
  localStorage.setItem(LAST_ROOM_KEY, code);
}

function clearSavedPlayerId(code) {
  sessionStorage.removeItem(`${TAB_PLAYER_PREFIX}${code}`);
  localStorage.removeItem(`${SAVED_PLAYER_PREFIX}${code}`);
  if (localStorage.getItem(LAST_ROOM_KEY) === code) localStorage.removeItem(LAST_ROOM_KEY);
}

export function getSavedRoomCode() {
  return localStorage.getItem(LAST_ROOM_KEY) || "";
}
