import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { CATEGORY_MODES, QUESTION_BY_ID, TRIVIA_QUESTIONS } from "./src/questions.js";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const publicBaseUrl = process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL || "";
const root = process.cwd();
const rooms = new Map();
const streams = new Map();
const roundTimers = new Map();
const wikiImageCache = new Map();
const maxRooms = 300;
const roomTtlMs = 6 * 60 * 60 * 1000;
const maxJsonBytes = 8192;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".ts": "text/plain; charset=utf-8"
};

const defaultSettings = {
  roundCount: 10,
  timerSeconds: 15,
  categoryMode: "Mixed Party"
};

function resolveStaticPath(url) {
  const pathname = new URL(url, `http://localhost:${port}`).pathname;
  const requestPath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const allowedFile = requestPath === "/index.html"
    || requestPath === "/sw.js"
    || requestPath === "/src/styles.css"
    || requestPath === "/src/app.bundle.js"
    || requestPath === "/public/manifest.webmanifest"
    || requestPath.startsWith("/public/icons/")
    || requestPath.startsWith("/public/sounds/");

  if (!allowedFile) throw httpError(404, "File not found.");

  const relativePath = requestPath.replace(/^\/+/, "");
  if (relativePath.includes("\0") || relativePath.split("/").some((part) => part === ".." || part.startsWith("."))) {
    throw httpError(404, "File not found.");
  }

  const rootPath = resolve(root);
  const filePath = resolve(root, relativePath);
  if (filePath !== rootPath && !filePath.startsWith(`${rootPath}${sep}`)) {
    throw httpError(404, "File not found.");
  }

  return filePath;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || `localhost:${port}`}`);

  try {
    if (url.pathname === "/healthz") {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (url.pathname === "/api/wiki-image") {
      await handleWikiImage(req, res, url);
      return;
    }

    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    const filePath = resolveStaticPath(req.url || "/");
    const body = await readFile(filePath);
    res.writeHead(200, {
      ...securityHeaders(),
      "Content-Type": types[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(body);
  } catch (error) {
    if (url.pathname.startsWith("/api/")) {
      sendJson(res, error.status || 500, { error: error.message || "Something went wrong." });
      return;
    }

    if (url.pathname.startsWith("/images/questions/")) {
      const svg = createGeneratedQuestionImage(url.pathname);
      res.writeHead(200, {
        ...securityHeaders(),
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store"
      });
      res.end(svg);
      return;
    }

    if (isAssetPath(url.pathname)) {
      res.writeHead(404, { ...securityHeaders(), "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
      res.end("Not found.");
      return;
    }

    const fallback = await readFile(join(root, "index.html"));
    res.writeHead(200, { ...securityHeaders(), "Content-Type": types[".html"], "Cache-Control": "no-store" });
    res.end(fallback);
  }
});

server.listen(port, host, () => {
  const localUrl = host === "0.0.0.0" ? `http://localhost:${port}` : `http://${host}:${port}`;
  console.log(`Atwix Trivia is running at ${localUrl}`);
});

async function handleApi(req, res, url) {
  const parts = url.pathname.split("/").filter(Boolean);

  if (req.method === "POST" && url.pathname === "/api/rooms") {
    const body = await readJson(req);
    const result = createRoom(body.displayName, req);
    sendJson(res, 201, { room: publicRoom(result.room), player: result.player });
    return;
  }

  if (parts[0] !== "api" || parts[1] !== "rooms" || !parts[2]) {
    throw httpError(404, "Unknown API route.");
  }

  const code = normalizeCode(parts[2]);
  const room = readRoom(code);
  tickRoom(room);

  if (req.method === "GET" && parts.length === 3) {
    sendJson(res, 200, { room: publicRoom(room) });
    return;
  }

  if (req.method === "GET" && parts[3] === "events") {
    openRoomStream(req, res, room);
    return;
  }

  if (req.method !== "POST") throw httpError(405, "Use a supported room action.");

  const body = await readJson(req);
  let payload;

  if (parts[3] === "join") payload = joinRoom(room, body.displayName, body.playerId);
  else if (parts[3] === "settings") payload = { room: updateSettings(room, body.playerId, body.settings) };
  else if (parts[3] === "start") payload = { room: startGame(room, body.playerId) };
  else if (parts[3] === "answer") payload = { room: submitAnswer(room, body.playerId, body.choiceIndex) };
  else if (parts[3] === "tick") payload = { room };
  else if (parts[3] === "show-leaderboard") payload = { room: showLeaderboard(room, body.playerId) };
  else if (parts[3] === "next") payload = { room: nextQuestion(room, body.playerId) };
  else if (parts[3] === "play-again") payload = { room: playAgain(room, body.playerId) };
  else throw httpError(404, "Unknown room action.");

  touch(room);
  broadcast(room);
  sendJson(res, 200, {
    ...payload,
    room: publicRoom(room)
  });
}

async function handleWikiImage(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") throw httpError(405, "Use GET for image clues.");

  const topic = String(url.searchParams.get("topic") || "").trim().replace(/\s+/g, " ");
  if (!topic || topic.length > 90) throw httpError(400, "Missing image topic.");

  const cacheKey = topic.toLowerCase();
  let imageUrl = wikiImageCache.get(cacheKey);

  if (!imageUrl) {
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic.replaceAll(" ", "_"))}`;
    const response = await fetch(summaryUrl, {
      headers: {
        "User-Agent": "AtwixTrivia/0.1 image clues"
      }
    });

    if (!response.ok) throw httpError(404, "Real image unavailable.");
    const data = await response.json();
    imageUrl = data.originalimage?.source || data.thumbnail?.source;
    if (!imageUrl) throw httpError(404, "Real image unavailable.");

    wikiImageCache.set(cacheKey, imageUrl);
  }

  res.writeHead(302, {
    ...securityHeaders(),
    Location: imageUrl,
    "Cache-Control": "public, max-age=86400"
  });
  res.end();
}

function createRoom(displayName, req) {
  pruneRooms();
  const cleanName = normalizeName(displayName);
  if (!cleanName) throw httpError(400, "Add your display name first.");

  let code = createCode();
  while (rooms.has(code)) code = createCode();

  const player = createPlayer(cleanName);
  const now = Date.now();
  const inviteUrl = new URL("/", getPublicOrigin(req));
  inviteUrl.searchParams.set("room", code);

  const room = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${now}-${code}`,
    code,
    inviteUrl: inviteUrl.toString(),
    hostId: player.id,
    players: [player],
    settings: { ...defaultSettings },
    status: "lobby",
    currentRoundIndex: 0,
    selectedQuestionIds: [],
    currentQuestionStartedAt: null,
    currentQuestionEndsAt: null,
    answers: {},
    scores: { [player.id]: 0 },
    streaks: { [player.id]: 0 },
    stats: { [player.id]: createStats() },
    previousLeaderboard: [],
    lastLeaderboard: [],
    roundResults: [],
    nextReady: {},
    createdAt: now,
    updatedAt: now
  };

  rooms.set(code, room);
  return { room, player };
}

function joinRoom(room, displayName, playerId) {
  if (room.status !== "lobby") throw httpError(409, "That game already started. Join the next one.");

  const cleanName = normalizeName(displayName);
  if (!cleanName) throw httpError(400, "Add your display name first.");

  const existing = room.players.find((player) => player.id === playerId);
  if (existing) {
    existing.displayName = cleanName;
    return { room, player: existing };
  }

  if (room.players.length >= 12) throw httpError(409, "That room is full. Max 12 players.");

  const player = createPlayer(cleanName);
  room.players.push(player);
  room.scores[player.id] = 0;
  room.streaks[player.id] = 0;
  room.stats[player.id] = createStats();
  return { room, player };
}

function updateSettings(room, playerId, settings = {}) {
  assertHost(room, playerId);
  if (room.status !== "lobby") throw httpError(409, "Settings can only change before the game starts.");

  const roundCount = Number(settings.roundCount);
  const timerSeconds = Number(settings.timerSeconds);
  const categoryMode = String(settings.categoryMode || "");

  if (![5, 10, 15, 20, 30].includes(roundCount)) throw httpError(400, "Choose 5, 10, 15, 20, or 30 rounds.");
  if (![10, 15, 20, 30].includes(timerSeconds)) throw httpError(400, "Choose a 10, 15, 20, or 30 second timer.");
  if (!CATEGORY_MODES.includes(categoryMode)) throw httpError(400, "Choose a valid category mode.");

  room.settings = { roundCount, timerSeconds, categoryMode };
  return room;
}

function startGame(room, playerId) {
  assertHost(room, playerId);
  if (room.status !== "lobby") return room;
  if (room.players.length < 2) throw httpError(409, "You need at least 2 players.");

  resetGameStats(room);
  room.selectedQuestionIds = selectQuestions(room.settings);
  room.currentRoundIndex = 0;
  room.nextReady = {};
  beginQuestion(room);
  return room;
}

function submitAnswer(room, playerId, choiceIndex) {
  tickRoom(room);
  if (room.status !== "question") throw httpError(409, "This question is not accepting answers.");
  if (!room.players.some((player) => player.id === playerId)) throw httpError(403, "Rejoin the room to answer.");

  const now = Date.now();
  if (now < room.currentQuestionStartedAt) throw httpError(409, "Wait for the countdown.");
  if (now > room.currentQuestionEndsAt) {
    finalizeRound(room);
    throw httpError(409, "Too late. The timer hit zero.");
  }

  const index = Number(choiceIndex);
  if (![0, 1, 2, 3].includes(index)) throw httpError(400, "Choose one of the four answers.");

  const questionId = room.selectedQuestionIds[room.currentRoundIndex];
  room.answers[questionId] ||= {};
  if (room.answers[questionId][playerId]) throw httpError(409, "Answer locked. No changes.");

  const answeredInMs = now - room.currentQuestionStartedAt;
  const timeRemainingMs = Math.max(0, room.currentQuestionEndsAt - now);
  room.answers[questionId][playerId] = {
    playerId,
    questionId,
    choiceIndex: index,
    answeredAt: now,
    answeredInMs,
    timeRemainingMs
  };
  room.stats[playerId].answeredCount += 1;

  if (activePlayers(room).every((player) => room.answers[questionId][player.id])) {
    finalizeRound(room);
  }

  return room;
}

function showLeaderboard(room, playerId) {
  assertHost(room, playerId);
  if (room.status !== "reveal") return room;
  room.status = "leaderboard";
  room.nextReady = {};
  return room;
}

function nextQuestion(room, playerId) {
  if (!room.players.some((player) => player.id === playerId)) throw httpError(403, "Rejoin the room to continue.");
  if (room.status !== "leaderboard") throw httpError(409, "Show the leaderboard before moving on.");

  const ready = currentReadyMap(room);
  ready[playerId] = Date.now();
  if (!activePlayers(room).every((player) => ready[player.id])) return room;

  if (room.currentRoundIndex >= room.selectedQuestionIds.length - 1) {
    room.status = "finished";
    room.finalAwards = buildAwards(room);
    room.nextReady = {};
    return room;
  }

  room.currentRoundIndex += 1;
  beginQuestion(room);
  return room;
}

function playAgain(room, playerId) {
  assertHost(room, playerId);
  room.status = "lobby";
  room.currentRoundIndex = 0;
  room.selectedQuestionIds = [];
  room.currentQuestionStartedAt = null;
  room.currentQuestionEndsAt = null;
  room.answers = {};
  room.roundResults = [];
  room.previousLeaderboard = [];
  room.lastLeaderboard = [];
  room.finalAwards = null;
  room.nextReady = {};
  resetGameStats(room);
  return room;
}

function beginQuestion(room) {
  const now = Date.now();
  room.status = "question";
  room.answers = {};
  room.nextReady = {};
  room.currentQuestionStartedAt = now + 3000;
  room.currentQuestionEndsAt = room.currentQuestionStartedAt + room.settings.timerSeconds * 1000;
  scheduleRoundEnd(room);
}

function tickRoom(room) {
  if (room.status === "question" && room.currentQuestionEndsAt && Date.now() >= room.currentQuestionEndsAt) {
    finalizeRound(room);
    touch(room);
    broadcast(room);
  }
}

function finalizeRound(room) {
  if (room.status !== "question") return;
  clearRoundTimer(room.code);

  const questionId = room.selectedQuestionIds[room.currentRoundIndex];
  const question = QUESTION_BY_ID[questionId];
  const answers = room.answers[questionId] || {};
  const answerCounts = [0, 0, 0, 0];
  const previous = room.lastLeaderboard.length ? room.lastLeaderboard : buildLeaderboard(room);
  room.previousLeaderboard = previous;

  const playerResults = activePlayers(room).map((player) => {
    const answer = answers[player.id] || null;
    if (answer) answerCounts[answer.choiceIndex] += 1;

    const isCorrect = Boolean(answer && answer.choiceIndex === question.correctIndex);
    let speedBonus = 0;
    let streakBonus = 0;
    let points = 0;

    if (isCorrect) {
      room.streaks[player.id] = (room.streaks[player.id] || 0) + 1;
      const streak = room.streaks[player.id];
      if (streak >= 7) streakBonus = 75;
      else if (streak >= 5) streakBonus = 50;
      else if (streak >= 3) streakBonus = 20;

      const timeRemaining = Math.max(0, answer.timeRemainingMs / 1000);
      speedBonus = Math.round(50 * (timeRemaining / room.settings.timerSeconds));
      points = 100 + speedBonus + streakBonus;
      room.stats[player.id].correctAnswers += 1;
      room.stats[player.id].totalCorrectTimeMs += answer.answeredInMs;
      room.stats[player.id].longestStreak = Math.max(room.stats[player.id].longestStreak, streak);
    } else {
      room.streaks[player.id] = 0;
      if (answer) room.stats[player.id].wrongAnswers += 1;
    }

    room.scores[player.id] = (room.scores[player.id] || 0) + points;
    room.stats[player.id].currentStreak = room.streaks[player.id] || 0;
    room.stats[player.id].bestRoundGain = Math.max(room.stats[player.id].bestRoundGain, points);

    return {
      playerId: player.id,
      choiceIndex: answer?.choiceIndex ?? null,
      isCorrect,
      answeredInMs: answer?.answeredInMs ?? null,
      timeRemainingMs: answer?.timeRemainingMs ?? 0,
      basePoints: isCorrect ? 100 : 0,
      speedBonus,
      streakBonus,
      points
    };
  });

  const fastestCorrect = playerResults
    .filter((result) => result.isCorrect)
    .sort((a, b) => a.answeredInMs - b.answeredInMs)[0] || null;

  if (fastestCorrect) room.stats[fastestCorrect.playerId].fastestCorrectCount += 1;

  const leaderboard = buildLeaderboard(room, previous);
  room.lastLeaderboard = leaderboard;
  room.roundResults[room.currentRoundIndex] = {
    roundIndex: room.currentRoundIndex,
    questionId,
    correctIndex: question.correctIndex,
    correctAnswer: question.choices[question.correctIndex],
    explanation: question.explanation,
    answerCounts,
    playerResults,
    fastestCorrectPlayerId: fastestCorrect?.playerId || null,
    leaderboard
  };
  room.status = "reveal";
}

function buildLeaderboard(room, previous = room.previousLeaderboard || []) {
  const previousRanks = new Map(previous.map((entry) => [entry.playerId, entry.rank]));
  return activePlayers(room)
    .map((player) => {
      const stats = room.stats[player.id] || createStats();
      const avgCorrectMs = stats.correctAnswers ? stats.totalCorrectTimeMs / stats.correctAnswers : Number.POSITIVE_INFINITY;
      return {
        playerId: player.id,
        displayName: player.displayName,
        totalPoints: room.scores[player.id] || 0,
        correctAnswers: stats.correctAnswers,
        currentStreak: room.streaks[player.id] || 0,
        longestStreak: stats.longestStreak,
        avgCorrectMs,
        movement: "same",
        rank: 0
      };
    })
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
      return a.avgCorrectMs - b.avgCorrectMs;
    })
    .map((entry, index) => {
      const rank = index + 1;
      const previousRank = previousRanks.get(entry.playerId);
      let movement = "same";
      if (previousRank && previousRank > rank) movement = "up";
      if (previousRank && previousRank < rank) movement = "down";
      return { ...entry, rank, previousRank: previousRank || null, rankChange: previousRank ? previousRank - rank : 0, movement };
    });
}

function buildAwards(room) {
  const leaderboard = buildLeaderboard(room);
  const statsEntries = activePlayers(room).map((player) => ({ player, stats: room.stats[player.id] || createStats() }));
  const by = (selector) => [...statsEntries].sort((a, b) => selector(b) - selector(a))[0]?.player.id || null;
  return {
    winnerId: leaderboard[0]?.playerId || null,
    fastestThinkerId: by((entry) => entry.stats.fastestCorrectCount),
    bestComebackId: by((entry) => entry.stats.bestRoundGain),
    longestStreakId: by((entry) => entry.stats.longestStreak),
    mostConfidentlyWrongId: by((entry) => entry.stats.wrongAnswers)
  };
}

function publicRoom(room) {
  const copy = structuredClone(room);
  if (copy.status === "question") {
    const questionId = copy.selectedQuestionIds[copy.currentRoundIndex];
    const answers = copy.answers[questionId] || {};
    const lockedAnswers = Object.fromEntries(Object.entries(answers).map(([playerId, answer]) => [
      playerId,
      { playerId, questionId, answeredAt: answer.answeredAt, locked: true }
    ]));
    copy.answers = Object.keys(lockedAnswers).length ? { [questionId]: lockedAnswers } : {};
  }
  return copy;
}

function selectQuestions(settings) {
  const pool = settings.categoryMode === "Mixed Party"
    ? TRIVIA_QUESTIONS
    : TRIVIA_QUESTIONS.filter((question) => question.category === settings.categoryMode);
  const uniquePool = uniqueQuestionsForSession(pool);
  const roundCount = Math.min(settings.roundCount, uniquePool.length);
  const easyTarget = Math.min(Math.max(1, Math.floor(roundCount * 0.25)), Math.ceil(roundCount / 3));
  const hardTarget = Math.min(Math.max(1, Math.floor(roundCount * 0.18)), Math.floor(roundCount / 4));
  const selected = [
    ...takeDifficulty(uniquePool, "Medium", roundCount - easyTarget - hardTarget),
    ...takeDifficulty(uniquePool, "Hard", hardTarget),
    ...takeDifficulty(uniquePool, "Easy", easyTarget)
  ];
  const selectedIds = new Set(selected.map((question) => question.id));
  const remaining = uniquePool.filter((question) => !selectedIds.has(question.id));

  for (const question of remaining) {
    if (selected.length >= roundCount) break;
    selected.push(question);
  }

  return orderSessionQuestions(selected.slice(0, roundCount)).map((question) => question.id);
}

function uniqueQuestionsForSession(pool) {
  const seenIds = new Set();
  const seenPrompts = new Set();
  const unique = [];
  for (const question of shuffle(pool)) {
    const promptKey = normalizePromptKey(question);
    if (seenIds.has(question.id) || seenPrompts.has(promptKey)) continue;
    seenIds.add(question.id);
    seenPrompts.add(promptKey);
    unique.push(question);
  }
  return unique;
}

function normalizePromptKey(question) {
  if (question.mediaType === "image") {
    return `${question.category}:${question.question}:${question.choices?.[question.correctIndex] || question.imageUrl || question.id}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  return `${question.category}:${question.question}`
    .toLowerCase()
    .replace(/^(quick one|speed round|no overthinking|party check|protect your streak|fast fingers|for the bragging rights|room check):\s*/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function takeDifficulty(pool, difficulty, count) {
  const selectedIds = new Set(pool.__selectedIds || []);
  const picked = [];
  for (const question of pool) {
    if (picked.length >= count) break;
    if (selectedIds.has(question.id) || question.difficulty !== difficulty) continue;
    selectedIds.add(question.id);
    picked.push(question);
  }
  pool.__selectedIds = selectedIds;
  return picked;
}

function orderSessionQuestions(questions) {
  const buckets = {
    Easy: questions.filter((question) => question.difficulty === "Easy"),
    Medium: questions.filter((question) => question.difficulty === "Medium"),
    Hard: questions.filter((question) => question.difficulty === "Hard")
  };
  const ordered = [];
  const take = (order) => {
    for (const difficulty of order) {
      const question = buckets[difficulty].shift();
      if (question) return question;
    }
    return null;
  };

  while (ordered.length < questions.length) {
    const index = ordered.length;
    const question = index === 0
      ? take(["Easy", "Medium", "Hard"])
      : index % 5 === 4
        ? take(["Hard", "Medium", "Easy"])
        : take(["Medium", "Hard", "Easy"]);
    if (!question) break;
    ordered.push(question);
  }

  return ordered;
}

function currentReadyMap(room) {
  room.nextReady ||= {};
  const activeIds = new Set(activePlayers(room).map((player) => player.id));
  for (const playerId of Object.keys(room.nextReady)) {
    if (!activeIds.has(playerId)) delete room.nextReady[playerId];
  }
  return room.nextReady;
}

function scheduleRoundEnd(room) {
  clearRoundTimer(room.code);
  const delay = Math.max(0, room.currentQuestionEndsAt - Date.now() + 25);
  const timer = setTimeout(() => {
    const activeRoom = rooms.get(room.code);
    if (!activeRoom || activeRoom.status !== "question") return;
    finalizeRound(activeRoom);
    touch(activeRoom);
    broadcast(activeRoom);
  }, delay);
  roundTimers.set(room.code, timer);
}

function clearRoundTimer(code) {
  const timer = roundTimers.get(code);
  if (!timer) return;
  clearTimeout(timer);
  roundTimers.delete(code);
}

function resetGameStats(room) {
  room.scores = {};
  room.streaks = {};
  room.stats = {};
  for (const player of activePlayers(room)) {
    room.scores[player.id] = 0;
    room.streaks[player.id] = 0;
    room.stats[player.id] = createStats();
  }
  room.answers = {};
  room.roundResults = [];
  room.previousLeaderboard = [];
  room.lastLeaderboard = [];
}

function createStats() {
  return {
    totalPoints: 0,
    correctAnswers: 0,
    answeredCount: 0,
    wrongAnswers: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCorrectTimeMs: 0,
    fastestCorrectCount: 0,
    bestRoundGain: 0
  };
}

function activePlayers(room) {
  return room.players;
}

function assertHost(room, playerId) {
  if (room.hostId !== playerId) throw httpError(403, "Only the host can do that.");
}

function readRoom(code) {
  if (!code || code.length !== 5) throw httpError(400, "Room codes are 5 characters long.");
  const room = rooms.get(code);
  if (!room) throw httpError(404, "We could not find that room. Check the code and try again.");
  return room;
}

function openRoomStream(req, res, room) {
  res.writeHead(200, {
    ...securityHeaders(),
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  res.write(`event: room\ndata: ${JSON.stringify(publicRoom(room))}\n\n`);

  const roomStreams = streams.get(room.code) || new Set();
  roomStreams.add(res);
  streams.set(room.code, roomStreams);
  const heartbeat = setInterval(() => {
    res.write(": ping\n\n");
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    roomStreams.delete(res);
    if (!roomStreams.size) streams.delete(room.code);
  });
}

function broadcast(room) {
  const roomStreams = streams.get(room.code);
  if (!roomStreams) return;
  for (const stream of roomStreams) {
    stream.write(`event: room\ndata: ${JSON.stringify(publicRoom(room))}\n\n`);
  }
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > maxJsonBytes) throw httpError(413, "That request is too large.");
  }
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw httpError(400, "Send valid JSON.");
  }
}

function getPublicOrigin(req) {
  if (publicBaseUrl) return publicBaseUrl;
  const forwardedHost = req.headers["x-forwarded-host"];
  const forwardedProto = req.headers["x-forwarded-proto"];
  const hostHeader = Array.isArray(forwardedHost)
    ? forwardedHost[0]
    : forwardedHost || req.headers.host || `localhost:${port}`;
  const protoHeader = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  const protocol = protoHeader || (hostHeader.includes("localhost") || hostHeader.startsWith("127.") ? "http" : "https");
  return `${protocol}://${hostHeader}`;
}

function pruneRooms() {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.updatedAt > roomTtlMs) {
      clearRoundTimer(code);
      rooms.delete(code);
    }
  }

  if (rooms.size <= maxRooms) return;
  const oldest = [...rooms.entries()].sort((a, b) => a[1].updatedAt - b[1].updatedAt);
  for (const [code] of oldest.slice(0, rooms.size - maxRooms)) {
    clearRoundTimer(code);
    rooms.delete(code);
  }
}

function securityHeaders() {
  return {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' https: data:",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join("; ")
  };
}

function isAssetPath(pathname) {
  return pathname.startsWith("/src/")
    || pathname.startsWith("/public/")
    || pathname.startsWith("/images/")
    || pathname === "/sw.js"
    || pathname === "/favicon.ico";
}

function createGeneratedQuestionImage(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const folder = parts.at(-2) || "questions";
  const file = parts.at(-1) || "visual-clue.svg";
  const slug = file.replace(/\.[^.]+$/, "").replace(/-placeholder$/, "").replace(/-visual-clue$/, "");
  const label = generatedAltLabel(slug, folder);
  const palette = paletteFromSlug(slug);
  const icon = iconForVisual(folder, slug);
  const pattern = patternForVisual(folder, slug, palette);
  const markSize = icon.length > 4 ? 118 : icon.length > 2 ? 150 : 190;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${palette[0]}"/>
      <stop offset="58%" stop-color="${palette[1]}"/>
      <stop offset="100%" stop-color="${palette[2]}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <circle cx="160" cy="120" r="210" fill="#fff" opacity="0.08"/>
  <circle cx="1070" cy="570" r="260" fill="#fff" opacity="0.08"/>
  <rect x="110" y="80" width="980" height="515" rx="34" fill="#08101f" opacity="0.5" filter="url(#shadow)"/>
  ${pattern}
  <text x="600" y="344" text-anchor="middle" dominant-baseline="middle" font-size="${markSize}" font-family="Arial, Helvetica, sans-serif" font-weight="950" fill="#fff" letter-spacing="2">${escapeXml(icon)}</text>
</svg>`;
}

function generatedAltLabel(slug, folder) {
  return `${readableSlug(slug)} ${typeLabel(folder).toLowerCase()}`;
}

function iconForVisual(folder, slug) {
  if (folder === "geography" && slug.endsWith("-flag")) return flagEmoji(slug.replace(/-flag$/, "")) || "⚑";
  const known = {
    "eiffel-tower": "🗼",
    "mount-fuji": "🗻",
    "machu-picchu": "⛰",
    "santorini": "🏝",
    "venice-grand-canal": "🚤",
    "giraffe": "🦒",
    "zebra": "🦓",
    "panda": "🐼",
    "cheetah": "🐆",
    "lion": "🦁",
    "tiger": "🐅",
    "elephant": "🐘",
    "crocodile": "🐊",
    "penguin": "🐧",
    "dolphin": "🐬",
    "octopus": "🐙",
    "whale-shark": "🦈",
    "red-panda": "🐾",
    "chameleon": "🦎",
    "axolotl": "🦎",
    "nike-swoosh": "✓",
    "golden-arches": "〽",
    "three-stripes": "///",
    "crocodile": "🐊",
    "bull-badge": "♉",
    "three-pointed-star": "✶",
    "bmw-badge": "◉",
    "gg": "GG",
    "lv": "LV",
    "medusa": "◎",
    "check-pattern": "▦",
    "orange-kit": "▰",
    "black-white-stripes": "▥",
    "snowman": "☃",
    "lion-cub": "🦁",
    "toy": "🧸"
  };
  const compact = cleanVisualSlug(slug);
  if (known[slug] || known[compact]) return known[slug] || known[compact];
  if (["brands", "luxury-fashion", "cars", "football", "movies-tv"].includes(folder)) return monogram(compact);
  return defaultIcon(folder);
}

function defaultIcon(folder) {
  return {
    geography: "⚑",
    landmarks: "⌂",
    animals: "🐾",
    brands: "◆",
    cars: "◉",
    football: "⚽",
    "movies-tv": "🎬",
    "luxury-fashion": "◇"
  }[folder] || "?";
}

function patternForVisual(folder, slug, palette) {
  if (folder === "geography" && slug.endsWith("-flag")) {
    return `<rect x="240" y="185" width="720" height="290" rx="22" fill="#fff" opacity="0.94"/>
      <rect x="260" y="205" width="680" height="83" fill="${palette[0]}"/>
      <rect x="260" y="288" width="680" height="83" fill="${palette[1]}"/>
      <rect x="260" y="371" width="680" height="84" fill="${palette[2]}"/>`;
  }
  if (folder === "brands" || folder === "luxury-fashion" || folder === "cars") {
    return `<circle cx="600" cy="336" r="178" fill="#fff" opacity="0.14"/>
      <circle cx="600" cy="336" r="132" fill="#0b1020" opacity="0.58"/>
      <path d="M410 430 C492 496, 710 496, 790 430" fill="none" stroke="#fff" stroke-width="16" opacity="0.22" stroke-linecap="round"/>`;
  }
  if (folder === "football") {
    return `<rect x="364" y="160" width="472" height="320" rx="24" fill="#fff" opacity="0.1"/>
      <path d="M364 224 H836 M364 416 H836 M458 160 V480 M742 160 V480" stroke="#fff" stroke-width="8" opacity="0.16"/>`;
  }
  return `<rect x="310" y="150" width="580" height="330" rx="28" fill="#fff" opacity="0.1"/>
    <circle cx="420" cy="250" r="54" fill="#fff" opacity="0.12"/>
    <path d="M330 456 L500 330 L640 430 L742 304 L872 456 Z" fill="#fff" opacity="0.14"/>`;
}

function typeLabel(folder) {
  return {
    geography: "Flag question",
    landmarks: "Landmark question",
    animals: "Animal question",
    brands: "Logo question",
    cars: "Car question",
    football: "Football question",
    "movies-tv": "Visual question",
    "luxury-fashion": "Style question"
  }[folder] || "Image question";
}

function cleanVisualSlug(slug) {
  return slug
    .replace(/-(badge|placeholder|silhouette|visual|clue|flag|kit|style|logo|question)$/g, "")
    .replace(/-placeholder$/g, "");
}

function readableSlug(slug) {
  return cleanVisualSlug(slug).split("-").filter(Boolean).map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");
}

function monogram(slug) {
  const words = cleanVisualSlug(slug).split("-").filter(Boolean);
  if (!words.length) return "◆";
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 3).map((word) => word[0]).join("").toUpperCase();
}

function paletteFromSlug(slug) {
  const palettes = [
    ["#ff4fd8", "#7c5cff", "#38d9ff"],
    ["#b6ff4d", "#16a34a", "#0f766e"],
    ["#ffd166", "#ef476f", "#7c2d12"],
    ["#60a5fa", "#2563eb", "#111827"],
    ["#f97316", "#db2777", "#581c87"],
    ["#f8fafc", "#94a3b8", "#0f172a"]
  ];
  let sum = 0;
  for (const char of slug) sum += char.charCodeAt(0);
  return palettes[sum % palettes.length];
}

function flagEmoji(countrySlug) {
  const codes = {
    france: "FR", germany: "DE", italy: "IT", spain: "ES", portugal: "PT", netherlands: "NL", belgium: "BE", switzerland: "CH",
    austria: "AT", sweden: "SE", norway: "NO", denmark: "DK", finland: "FI", ireland: "IE", "united-kingdom": "GB", greece: "GR",
    turkey: "TR", poland: "PL", "czech-republic": "CZ", hungary: "HU", romania: "RO", croatia: "HR", serbia: "RS", bulgaria: "BG",
    ukraine: "UA", iceland: "IS", morocco: "MA", egypt: "EG", "south-africa": "ZA", kenya: "KE", nigeria: "NG", ghana: "GH",
    japan: "JP", "south-korea": "KR", china: "CN", india: "IN", thailand: "TH", vietnam: "VN", indonesia: "ID", philippines: "PH",
    australia: "AU", "new-zealand": "NZ", canada: "CA", "united-states": "US", mexico: "MX", brazil: "BR", argentina: "AR", chile: "CL",
    peru: "PE", colombia: "CO", jamaica: "JM", "saudi-arabia": "SA", "united-arab-emirates": "AE", qatar: "QA", israel: "IL",
    singapore: "SG", malaysia: "MY", pakistan: "PK", nepal: "NP", "sri-lanka": "LK"
  };
  const code = codes[countrySlug];
  if (!code) return "";
  return [...code].map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0))).join("");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    ...securityHeaders(),
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function touch(room) {
  room.updatedAt = Date.now();
  return room;
}

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function createPlayer(displayName) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    displayName,
    joinedAt: Date.now()
  };
}

function createCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function normalizeCode(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
}

function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 28);
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
