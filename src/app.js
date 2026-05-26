import { CATEGORY_MODES, QUESTION_BY_ID, TRIVIA_QUESTIONS } from "./questions.js";
import { getPhrase } from "./microcopy.js";
import {
  enableAudio,
  getAudioSettings,
  playSound,
  setMasterVolume,
  setMusicEnabled,
  setSoundEnabled,
  stopAllAudio
} from "./audio.js";
import {
  createRoom,
  getCurrentAnswer,
  getCurrentQuestionId,
  getPlayerResult,
  getRoundResult,
  joinRoom,
  nextQuestion,
  playAgain,
  readRoom,
  recoverPlayer,
  showLeaderboard,
  startGame,
  submitAnswer,
  subscribeToRoom,
  tickRoom,
  updateSettings
} from "./storage.js";

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const params = new URLSearchParams(window.location.search);

let state = {
  view: "landing",
  room: null,
  currentPlayer: null,
  playerId: params.get("player") || "",
  joinCode: params.get("room") || "",
  createName: "",
  joinName: "",
  error: "",
  loading: false,
  unsubscribe: null,
  timer: null,
  localChoices: new Map(),
  pendingAnswerKey: "",
  audioEvents: new Set(),
  installPrompt: null,
  canInstall: false,
  installDismissed: localStorage.getItem("room-rush-install-dismissed") === "true"
};

boot();
window.addEventListener("pagehide", stopAllAudio);
window.addEventListener("beforeunload", stopAllAudio);
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  state.installPrompt = event;
  state.canInstall = true;
  state.installDismissed = false;
  render();
});
window.addEventListener("appinstalled", () => {
  state.installPrompt = null;
  state.canInstall = false;
  state.installDismissed = true;
  localStorage.setItem("room-rush-install-dismissed", "true");
  showToast("Installed. Ready from your home screen.");
  render();
});

async function boot() {
  registerServiceWorker();
  if (state.joinCode) {
    const room = await readRoom(state.joinCode);
    if (room) {
      state.room = room;
      state.currentPlayer = recoverPlayer(room, state.playerId);
      state.view = state.currentPlayer ? "room" : "join";
      connectRoom(room.code);
    } else {
      state.view = "join";
      state.error = "We could not find that room. Check the code and try again.";
    }
  }
  render();
}

function render() {
  app.innerHTML = screenLayout(renderCurrentView());
  bindActions();
}

function renderCurrentView() {
  if (state.view === "create") return renderCreate();
  if (state.view === "join") return renderJoin();
  if (!state.room || !state.currentPlayer) return renderLanding();
  if (state.room.status === "lobby") return renderLobby();
  if (state.room.status === "question") {
    return Date.now() < state.room.currentQuestionStartedAt ? renderCountdown() : renderQuestion();
  }
  if (state.room.status === "reveal") return renderReveal();
  if (state.room.status === "leaderboard") return renderLeaderboard();
  if (state.room.status === "finished") return renderFinal();
  return renderLanding();
}

function screenLayout(content) {
  return `
    <section class="screen">
      <div class="rush-strip" aria-hidden="true">
        <span>Atwix</span>
        <span>Fast fingers</span>
        <span>Big points</span>
      </div>
      ${renderAudioControls()}
      ${state.error ? `<div class="error-banner"><strong>${escapeHtml(getPhrase("errorHelper", state.error))}</strong><span>${escapeHtml(state.error)}</span></div>` : ""}
      ${content}
    </section>
  `;
}

function renderAudioControls() {
  const audio = getAudioSettings();
  return `
    <section class="audio-controls" aria-label="Audio controls">
      <button class="audio-button" id="sound-toggle" type="button">
        ${audio.unlocked && audio.soundOn ? "🔊 Sound On" : audio.unlocked ? "🔇 Sound Off" : "Enable party sounds"}
      </button>
      ${audio.unlocked ? `
        <button class="audio-button" id="music-toggle" type="button">${audio.musicOn ? "🎵 Music On" : "Music Off"}</button>
        <label class="volume-control">
          <span>Volume</span>
          <input id="volume-slider" type="range" min="0" max="1" step="0.05" value="${audio.volume}" />
        </label>
      ` : ""}
    </section>
  `;
}

function renderLanding() {
  return `
    <section class="hero-panel">
      <p class="eyebrow">Party trivia for fast friends.</p>
      <h1>Atwix Trivia</h1>
      <p class="subtitle">${escapeHtml(getPhrase("landingSubtitle", "home"))}</p>
      <div class="hero-actions">
        <button class="primary-button" data-view="create">Create Game</button>
        <button class="secondary-button" data-view="join">Join Game</button>
      </div>
      <p class="helper">${escapeHtml(getPhrase("landingHelper", "home"))}</p>
    </section>
    ${renderInstallCard()}
  `;
}

function renderCreate() {
  return `
    <div class="topbar">
      <button class="ghost-button icon-button" data-view="landing" aria-label="Back">‹</button>
      <div>
        <p class="eyebrow">Create game</p>
        <h2>Start the room.</h2>
      </div>
    </div>
    <form class="panel form-panel" id="create-form">
      <label>
        <span>Your display name</span>
        <input name="displayName" autocomplete="nickname" maxlength="28" placeholder="Mira" value="${escapeAttr(state.createName)}" required />
      </label>
      <button class="primary-button wide" type="submit" ${state.loading ? "disabled" : ""}>Create Room</button>
    </form>
  `;
}

function renderJoin() {
  const roomIsFull = state.room && state.room.players.length >= 12 && !recoverPlayer(state.room, state.playerId);
  return `
    <div class="topbar">
      <button class="ghost-button icon-button" data-view="landing" aria-label="Back">‹</button>
      <div>
        <p class="eyebrow">Join game</p>
        <h2>${roomIsFull ? "Room is full." : "Enter the rush."}</h2>
      </div>
    </div>
    ${state.room && !roomIsFull ? `<p class="inline-note">Joining room <strong>${escapeHtml(state.room.code)}</strong>. ${escapeHtml(getPhrase("lobbyHelper", `join:${state.room.code}`))}</p>` : ""}
    <form class="panel form-panel" id="join-form">
      <label>
        <span>Your display name</span>
        <input name="displayName" autocomplete="nickname" maxlength="28" placeholder="Noah" value="${escapeAttr(state.joinName)}" ${roomIsFull ? "disabled" : "required"} />
      </label>
      <label>
        <span>Room code</span>
        <input name="roomCode" class="code-input" maxlength="5" placeholder="A8K2P" value="${escapeAttr(state.joinCode)}" ${roomIsFull ? "disabled" : "required"} />
      </label>
      <button class="primary-button wide" type="submit" ${state.loading || roomIsFull ? "disabled" : ""}>Join Game</button>
    </form>
  `;
}

function renderLobby() {
  const isHost = isCurrentHost();
  return `
    <div class="topbar">
      <div>
        <p class="eyebrow">Room ${state.room.code}</p>
        <h2>${state.room.players.length < 2 ? "Invite friends." : "Ready when you are."}</h2>
      </div>
      <button class="ghost-button" data-copy="${escapeAttr(state.room.inviteUrl)}">Copy Link</button>
    </div>
    ${renderInstallCard("lobby")}
    <section class="panel room-card">
      <div class="room-code-block">
        <span>Room code</span>
        <strong>${state.room.code}</strong>
      </div>
      <div class="share-row">
        <button class="secondary-button" data-copy="${escapeAttr(state.room.inviteUrl)}">Copy invite link</button>
        <button class="secondary-button" id="share-button">Share</button>
      </div>
    </section>
    <section class="panel">
      <div class="section-title">
        <h3>Players</h3>
        <span>${state.room.players.length}/12</span>
      </div>
      <div class="player-list">
        ${state.room.players.map((player) => `
          <div class="player-pill">
            <span>${escapeHtml(player.displayName)}${player.id === state.currentPlayer.id ? " <small>You</small>" : ""}</span>
            ${player.id === state.room.hostId ? `<strong>Host</strong>` : ""}
          </div>
        `).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="section-title">
        <h3>Game setup</h3>
        <span>${isHost ? "Host controls" : "Waiting"}</span>
      </div>
      ${isHost ? renderSettingsForm() : `<p class="helper">${escapeHtml(getPhrase("waitingForHost", state.room.code))}</p>`}
    </section>
  `;
}

function renderSettingsForm() {
  return `
    <form id="settings-form" class="settings-grid">
      <label>
        <span>Rounds</span>
        <select name="roundCount">
          ${[5, 10, 15, 20, 30].map((value) => `<option value="${value}" ${state.room.settings.roundCount === value ? "selected" : ""}>${value}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Timer</span>
        <select name="timerSeconds">
          ${[10, 15, 20, 30].map((value) => `<option value="${value}" ${state.room.settings.timerSeconds === value ? "selected" : ""}>${value}s</option>`).join("")}
        </select>
      </label>
      <label class="wide-field">
        <span>Category mode</span>
        <select name="categoryMode">
          ${CATEGORY_MODES.map((mode) => `<option value="${escapeAttr(mode)}" ${state.room.settings.categoryMode === mode ? "selected" : ""}>${escapeHtml(mode)}</option>`).join("")}
        </select>
      </label>
      <button class="primary-button wide-field" id="start-game" type="button" ${state.room.players.length < 2 ? "disabled" : ""}>Start Game</button>
    </form>
  `;
}

function renderInstallCard(context = "landing") {
  if (isStandaloneMode() || state.installDismissed) return "";
  const showNativeInstall = state.canInstall && state.installPrompt;
  return `
    <section class="install-card">
      <div>
        <p class="eyebrow">Phone app</p>
        <h3>${showNativeInstall ? "Install Atwix Trivia." : "Save it to your home screen."}</h3>
        <p>${showNativeInstall ? "Open it like a normal app when the room starts." : "On iPhone, tap Share, then Add to Home Screen."}</p>
      </div>
      <div class="install-actions">
        ${showNativeInstall ? `<button class="secondary-button" id="install-app">Install App</button>` : ""}
        <button class="ghost-button" id="dismiss-install">${context === "lobby" ? "Later" : "Not now"}</button>
      </div>
    </section>
  `;
}

function renderCountdown() {
  const question = getCurrentQuestion();
  const count = Math.max(1, Math.ceil((state.room.currentQuestionStartedAt - Date.now()) / 1000));
  return `
    <section class="countdown-panel">
      <p class="eyebrow">${escapeHtml(question.category)}</p>
      <div class="countdown-number">${count}</div>
      <h2>${escapeHtml(getPhrase("countdown", roundPhraseKey()))}</h2>
    </section>
  `;
}

function renderQuestion() {
  const question = getCurrentQuestion();
  const ownAnswer = getOwnCurrentAnswer();
  const selected = ownAnswer?.choiceIndex;
  const locked = Boolean(ownAnswer || state.pendingAnswerKey === answerKey());
  const remaining = Math.max(0, state.room.currentQuestionEndsAt - Date.now());
  const total = state.room.settings.timerSeconds * 1000;
  const percent = Math.max(0, Math.min(100, (remaining / total) * 100));
  const secondsLeft = Math.max(0, Math.ceil(remaining / 1000));
  const answeredCount = Object.keys(state.room.answers?.[getCurrentQuestionId(state.room)] || {}).length;
  return `
    <div class="progress-row">
      <span>Round ${state.room.currentRoundIndex + 1} of ${totalRounds()}</span>
      <strong class="timer-count">${secondsLeft}s left</strong>
    </div>
    <div class="progress-row mini-row">
      <span>${escapeHtml(question.category)}</span>
      <span>${answeredCount}/${state.room.players.length} answered</span>
    </div>
    <div class="timer-track"><span style="width:${percent}%"></span></div>
    <article class="question-card">
      <p class="card-category">${escapeHtml(question.difficulty)} · ${escapeHtml(question.category)}</p>
      ${renderQuestionMedia(question)}
      <h2>${escapeHtml(displayQuestionText(question))}</h2>
    </article>
    <section class="answer-grid">
      ${question.choices.map((choice, index) => `
        <button class="answer-option ${selected === index ? "selected" : ""}" data-choice="${index}" ${locked ? "disabled" : ""}>
          <strong>${String.fromCharCode(65 + index)}</strong>
          <span>${escapeHtml(choice)}</span>
        </button>
      `).join("")}
    </section>
    ${locked
      ? `<p class="inline-note">${escapeHtml(getPhrase("answerLocked", answerKey()))} ${escapeHtml(getPhrase("waitingAfterAnswer", roundPhraseKey()))} ${answeredCount}/${state.room.players.length} answered.</p>`
      : `<p class="helper">${escapeHtml(getPhrase("questionHelper", roundPhraseKey()))}</p>`}
  `;
}

function renderQuestionMedia(question) {
  if (question.mediaType !== "image" || !question.imageUrl) return "";
  const isExternal = /^https?:\/\//.test(question.imageUrl);
  const imageSrc = isExternal ? question.imageUrl : `${question.imageUrl}${question.imageUrl.includes("?") ? "&" : "?"}v=visual-card-3`;
  const mediaClass = question.imageUrl.includes("cdn.simpleicons.org")
    ? "logo-media"
    : question.imageUrl.includes("flagcdn.com")
      ? "flag-media"
      : "photo-media";
  return `
    <figure class="question-media ${mediaClass}">
      <img src="${escapeAttr(imageSrc)}" alt="${escapeAttr(question.imageAlt || question.question)}" loading="eager" decoding="sync" fetchpriority="high" onerror="this.closest('.question-media').classList.add('media-failed')" />
      <figcaption>${escapeHtml(question.imageCaption || "Visual clue")}</figcaption>
      <div class="media-fallback" aria-hidden="true">Image clue unavailable</div>
    </figure>
  `;
}

function renderReveal() {
  const question = getCurrentQuestion();
  const result = getRoundResult(state.room);
  const playerResult = getPlayerResult(state.room, state.currentPlayer.id);
  const revealStory = getRevealStory(result, playerResult);
  const fastest = playerName(result?.fastestCorrectPlayerId);
  const totalAnswers = Math.max(1, result?.answerCounts?.reduce((sum, count) => sum + count, 0) || 0);
  return `
    <div class="progress-row">
      <span>${escapeHtml(revealStory.kicker)}</span>
      <span>${escapeHtml(question.category)}</span>
    </div>
    <section class="reveal-answer ${playerResult?.isCorrect ? "correct" : "wrong"}">
      <p>${escapeHtml(revealStory.headline)}</p>
      <h2>${escapeHtml(result.correctAnswer)}</h2>
      <span>${escapeHtml(`${result.explanation} ${revealStory.body}`.trim())}</span>
    </section>
    <section class="panel">
      <div class="section-title">
        <h3>Answer split</h3>
        <span>${Math.round((result.answerCounts[result.correctIndex] / totalAnswers) * 100)}% correct</span>
      </div>
      <div class="answer-bars">
        ${question.choices.map((choice, index) => {
          const count = result.answerCounts[index] || 0;
          const pct = Math.round((count / totalAnswers) * 100);
          return `<div class="answer-bar ${index === result.correctIndex ? "is-correct" : ""}">
            <span>${String.fromCharCode(65 + index)} · ${escapeHtml(choice)}</span>
            <strong>${pct}%</strong>
          </div>`;
        }).join("")}
      </div>
    </section>
    <section class="panel">
      <div class="section-title">
        <h3>Player answers</h3>
        <span>${fastest ? `Fastest: ${escapeHtml(fastest)}` : "No correct answers"}</span>
      </div>
      <div class="points-list">
        ${result.playerResults.map((item) => `
          <div>
            <span>
              ${escapeHtml(playerName(item.playerId))}
              <small>${escapeHtml(playerAnswerLabel(question, item))}</small>
              ${item.streakBonus ? ` <small>Streak +${item.streakBonus}</small>` : ""}
            </span>
            <strong>${item.points}</strong>
          </div>
        `).join("")}
      </div>
      ${isCurrentHost() ? `<button class="primary-button wide" id="show-leaderboard">Show Leaderboard</button>` : `<p class="helper">${escapeHtml(getPhrase("waitingForHost", `reveal:${roundPhraseKey()}`))}</p>`}
    </section>
  `;
}

function renderLeaderboard() {
  const leaderboard = state.room.lastLeaderboard || [];
  const isLastRound = state.room.currentRoundIndex >= totalRounds() - 1;
  const story = getLeaderboardStory(leaderboard);
  const ready = state.room.nextReady || {};
  const readyCount = state.room.players.filter((player) => ready[player.id]).length;
  const currentReady = Boolean(ready[state.currentPlayer.id]);
  return `
    <section class="summary-hero">
      <p class="eyebrow">Leaderboard</p>
      <h1>${escapeHtml(story.headline)}</h1>
      <p>${escapeHtml(story.body)}</p>
    </section>
    <section class="leaderboard-list">
      ${leaderboard.map((entry) => renderLeaderboardEntry(entry)).join("")}
    </section>
    <section class="panel">
      <div class="section-title">
        <h3>${isLastRound ? "Final reveal check" : "Next question check"}</h3>
        <span>${readyCount}/${state.room.players.length} ready</span>
      </div>
      <p class="helper">${currentReady ? "You are ready. Waiting for the rest of the room." : "Everyone taps ready, then the next screen starts together."}</p>
      <div class="player-list ready-list">
        ${state.room.players.map((player) => `
          <div class="player-pill">
            <span>${escapeHtml(player.displayName)}${player.id === state.currentPlayer.id ? " <small>You</small>" : ""}</span>
            <strong>${ready[player.id] ? "Ready" : "Not yet"}</strong>
          </div>
        `).join("")}
      </div>
    </section>
    <button class="primary-button wide" id="next-question" ${currentReady ? "disabled" : ""}>${currentReady ? "Ready locked" : isLastRound ? "Ready for Final Results" : "Ready for Next Question"}</button>
  `;
}

function renderFinal() {
  const leaderboard = state.room.lastLeaderboard || [];
  const winner = leaderboard[0];
  const awards = state.room.finalAwards || {};
  const winnerLine = winner
    ? `${winner.displayName} takes the crown with ${winner.totalPoints} points.`
    : getPhrase("final", state.room.code);
  return `
    <section class="summary-hero final-hero">
      ${renderConfetti()}
      <p class="eyebrow">Final results</p>
      <h1>${winner ? `${escapeHtml(winner.displayName)} wins!` : "Game over!"}</h1>
      <p>${escapeHtml(winnerLine)}</p>
    </section>
    <section class="leaderboard-list">
      ${leaderboard.map((entry) => renderLeaderboardEntry(entry)).join("")}
    </section>
    <section class="panel">
      <div class="section-title">
        <h3>Fun awards</h3>
        <span>Group chat material</span>
      </div>
      <div class="awards-grid">
        ${renderAward("Winner", awards.winnerId)}
        ${renderAward("Fastest Thinker", awards.fastestThinkerId)}
        ${renderAward("Best Comeback", awards.bestComebackId)}
        ${renderAward("Longest Streak", awards.longestStreakId)}
        ${renderAward("Most Confidently Wrong", awards.mostConfidentlyWrongId)}
      </div>
    </section>
    <div class="summary-actions">
      ${isCurrentHost() ? `<button class="secondary-button" id="play-again">Play Again</button>` : ""}
      <button class="primary-button" data-view="create">New Room</button>
    </div>
  `;
}

function renderLeaderboardEntry(entry) {
  const movement = entry.rankChange > 0 ? `▲ ${entry.rankChange}` : entry.rankChange < 0 ? `▼ ${Math.abs(entry.rankChange)}` : "–";
  return `
    <article class="leaderboard-card rank-${entry.rank}">
      <strong>#${entry.rank}</strong>
      <div>
        <h3>${escapeHtml(entry.displayName)}</h3>
        <p>${entry.correctAnswers} correct · streak ${entry.currentStreak}</p>
      </div>
      <span>${movement}</span>
      <b>${entry.totalPoints}</b>
    </article>
  `;
}

function getLeaderboardStory(leaderboard) {
  const result = getRoundResult(state.room);
  const leader = leaderboard[0];
  const fastestName = playerName(result?.fastestCorrectPlayerId);
  const correctResults = result?.playerResults?.filter((item) => item.isCorrect) || [];
  const biggestClimber = [...leaderboard].filter((entry) => entry.rankChange > 0).sort((a, b) => b.rankChange - a.rankChange)[0];
  const topRound = [...(result?.playerResults || [])].sort((a, b) => b.points - a.points)[0];
  const topRoundName = topRound ? playerName(topRound.playerId) : "";

  if (!correctResults.length) {
    return {
      headline: "Full room trap.",
      body: "Nobody got it right, so every streak just hit the floor."
    };
  }

  if (leader?.previousRank && leader.previousRank > 1) {
    return {
      headline: "The crown moved.",
      body: `${leader.displayName} jumped from #${leader.previousRank} to #1. That changes the room.`
    };
  }

  if (biggestClimber && biggestClimber.rankChange >= 2) {
    return {
      headline: "Comeback with receipts.",
      body: `${biggestClimber.displayName} climbed ${biggestClimber.rankChange} places in one round.`
    };
  }

  if (topRound?.points >= 150 && topRoundName) {
    return {
      headline: "Perfect hit.",
      body: `${topRoundName} took ${topRound.points} points. Fast, correct, slightly annoying.`
    };
  }

  if (leader?.currentStreak >= 3) {
    return {
      headline: "Protect that streak.",
      body: `${leader.displayName} is leading with ${leader.currentStreak} correct in a row.`
    };
  }

  if (fastestName) {
    return {
      headline: "Speed won the argument.",
      body: `${fastestName} got the fastest correct answer this round.`
    };
  }

  return {
    headline: "The table shifts.",
    body: leader ? `${leader.displayName} is still the target at ${leader.totalPoints} points.` : "Nobody is safe for long."
  };
}

function getRevealStory(result, playerResult) {
  const correctResults = result?.playerResults?.filter((item) => item.isCorrect) || [];
  const totalPlayers = result?.playerResults?.length || state.room.players.length || 1;
  const fastestName = playerName(result?.fastestCorrectPlayerId);

  if (!playerResult || playerResult.choiceIndex === null || playerResult.choiceIndex === undefined) {
    return {
      kicker: "Clock won",
      headline: "No answer locked.",
      body: "The timer took that one."
    };
  }

  if (!correctResults.length) {
    return {
      kicker: "Room trap",
      headline: "Nobody got away clean.",
      body: "Every streak reset together."
    };
  }

  if (playerResult.isCorrect && result.fastestCorrectPlayerId === state.currentPlayer.id) {
    return {
      kicker: "Fastest correct",
      headline: "You hit first.",
      body: `Fastest in the room${playerResult.speedBonus ? `, with +${playerResult.speedBonus} speed` : ""}.`
    };
  }

  if (playerResult.isCorrect && playerResult.streakBonus) {
    return {
      kicker: "Streak paid",
      headline: `Correct, plus streak money.`,
      body: `Your streak bonus added +${playerResult.streakBonus}.`
    };
  }

  if (playerResult.isCorrect && correctResults.length <= Math.max(1, Math.floor(totalPlayers / 2))) {
    return {
      kicker: "Minority win",
      headline: "You were on the right side.",
      body: `${correctResults.length}/${totalPlayers} players got it.`
    };
  }

  if (playerResult.isCorrect) {
    return {
      kicker: "Clean points",
      headline: "Correct answer locked.",
      body: fastestName ? `${fastestName} was fastest this time.` : "Speed still mattered."
    };
  }

  const chosenCount = result.answerCounts?.[playerResult.choiceIndex] || 0;
  const correctCount = result.answerCounts?.[result.correctIndex] || 0;
  if (chosenCount > correctCount && chosenCount > 1) {
    return {
      kicker: "Crowd trap",
      headline: "Popular answer. Still wrong.",
      body: `${chosenCount} players fell for the same option.`
    };
  }

  return {
    kicker: "Missed it",
    headline: "Bold choice, wrong turn.",
    body: fastestName ? `${fastestName} was fastest on the correct answer.` : "Next round is the comeback round."
  };
}

function renderConfetti() {
  return `
    <div class="confetti" aria-hidden="true">
      ${Array.from({ length: 44 }, (_, index) => `<span style="--i:${index}; --x:${(index * 37) % 100}; --delay:${(index % 11) * 0.09}s; --spin:${index % 2 ? 1 : -1};"></span>`).join("")}
    </div>
  `;
}

function renderAward(label, playerId) {
  return `<div class="award"><span>${escapeHtml(label)}</span><strong>${escapeHtml(playerName(playerId) || "—")}</strong></div>`;
}

function bindActions() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.unsubscribe?.();
      clearInterval(state.timer);
      state.view = button.dataset.view;
      state.room = null;
      state.currentPlayer = null;
      state.playerId = "";
      state.error = "";
      state.pendingAnswerKey = "";
      state.localChoices.clear();
      state.audioEvents.clear();
      stopAllAudio();
      history.replaceState({}, "", window.location.pathname);
      render();
    });
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyText(button.dataset.copy, "Invite link copied."));
  });

  document.querySelector("#create-form")?.addEventListener("submit", handleCreate);
  document.querySelector("#create-form input[name='displayName']")?.addEventListener("input", (event) => {
    state.createName = event.target.value;
  });
  document.querySelector("#join-form")?.addEventListener("submit", handleJoin);
  document.querySelector("#join-form input[name='displayName']")?.addEventListener("input", (event) => {
    state.joinName = event.target.value;
  });
  document.querySelector("#join-form input[name='roomCode']")?.addEventListener("input", (event) => {
    state.joinCode = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
    event.target.value = state.joinCode;
  });

  document.querySelector("#settings-form")?.addEventListener("change", handleSettingsChange);
  document.querySelector("#start-game")?.addEventListener("click", () => safely(async () => {
    state.room = await startGame(state.room.code, state.currentPlayer.id);
    render();
  }));
  document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => handleAnswerSelect(Number(button.dataset.choice)));
  });
  document.querySelector("#show-leaderboard")?.addEventListener("click", () => safely(async () => {
    state.room = await showLeaderboard(state.room.code, state.currentPlayer.id);
    render();
  }));
  document.querySelector("#next-question")?.addEventListener("click", () => safely(async () => {
    state.room = await nextQuestion(state.room.code, state.currentPlayer.id);
    render();
  }));
  document.querySelector("#play-again")?.addEventListener("click", () => safely(async () => {
    state.room = await playAgain(state.room.code, state.currentPlayer.id);
    state.audioEvents.clear();
    stopAllAudio();
    render();
  }));
  document.querySelector("#share-button")?.addEventListener("click", handleShare);
  document.querySelector("#sound-toggle")?.addEventListener("click", handleSoundToggle);
  document.querySelector("#music-toggle")?.addEventListener("click", handleMusicToggle);
  document.querySelector("#volume-slider")?.addEventListener("input", handleVolumeChange);
  document.querySelector("#install-app")?.addEventListener("click", handleInstallApp);
  document.querySelector("#dismiss-install")?.addEventListener("click", () => {
    state.installDismissed = true;
    localStorage.setItem("room-rush-install-dismissed", "true");
    render();
  });
}

async function handleCreate(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  await safely(async () => {
    state.loading = true;
    render();
    const result = await createRoom(form.get("displayName"));
    state.room = result.room;
    state.currentPlayer = result.player;
    state.playerId = result.player.id;
    state.view = "room";
    state.createName = "";
    history.replaceState({}, "", playerUrl(state.room.code, state.currentPlayer.id));
    connectRoom(state.room.code);
  });
  state.loading = false;
  render();
}

async function handleJoin(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  await safely(async () => {
    state.loading = true;
    render();
    const result = await joinRoom(form.get("roomCode"), form.get("displayName"), state.playerId || null);
    state.room = result.room;
    state.currentPlayer = result.player;
    state.playerId = result.player.id;
    state.view = "room";
    state.joinName = "";
    state.joinCode = state.room.code;
    history.replaceState({}, "", playerUrl(state.room.code, state.currentPlayer.id));
    connectRoom(state.room.code);
  });
  state.loading = false;
  render();
}

async function handleSettingsChange(event) {
  const form = new FormData(event.currentTarget);
  await safely(async () => {
    state.room = await updateSettings(state.room.code, state.currentPlayer.id, {
      roundCount: Number(form.get("roundCount")),
      timerSeconds: Number(form.get("timerSeconds")),
      categoryMode: form.get("categoryMode")
    });
    render();
  });
}

async function handleShare() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Atwix Trivia",
        text: "Join my trivia room.",
        url: state.room.inviteUrl
      });
    } catch {
      showToast("Share canceled.");
    }
  } else {
    await copyText(state.room.inviteUrl, "Invite link copied.");
  }
}

async function handleSoundToggle() {
  const audio = getAudioSettings();
  if (!audio.unlocked) await enableAudio();
  else setSoundEnabled(!audio.soundOn);
  if (!getAudioSettings().soundOn) stopAllAudio();
  render();
}

function handleMusicToggle() {
  const audio = getAudioSettings();
  setMusicEnabled(!audio.musicOn);
  render();
}

function handleVolumeChange(event) {
  setMasterVolume(event.target.value);
}

async function handleInstallApp() {
  if (!state.installPrompt) return;
  const prompt = state.installPrompt;
  state.installPrompt = null;
  state.canInstall = false;
  prompt.prompt();
  const choice = await prompt.userChoice.catch(() => ({ outcome: "dismissed" }));
  if (choice.outcome === "accepted") {
    state.installDismissed = true;
    localStorage.setItem("room-rush-install-dismissed", "true");
  }
  render();
}

async function handleAnswerSelect(choiceIndex) {
  const key = answerKey();
  if (!key || getOwnCurrentAnswer() || state.pendingAnswerKey === key) return;

  state.localChoices.set(key, choiceIndex);
  state.pendingAnswerKey = key;
  state.error = "";
  playSound("answerLock");
  render();

  try {
    state.room = await submitAnswer(state.room.code, state.currentPlayer.id, choiceIndex);
  } catch (error) {
    const message = error.message || "Something went wrong.";
    state.error = message;
    if (!/Answer locked/i.test(message)) {
      state.localChoices.delete(key);
    }
  } finally {
    if (state.pendingAnswerKey === key) state.pendingAnswerKey = "";
    render();
  }
}

function connectRoom(code) {
  state.unsubscribe?.();
  state.unsubscribe = subscribeToRoom(code, (room) => {
    const previousStatus = state.room?.status || "";
    state.room = room;
    state.currentPlayer = recoverPlayer(room, state.currentPlayer?.id) || state.currentPlayer;
    if (room.status !== "question") state.pendingAnswerKey = "";
    if (room.status === "lobby" && previousStatus && previousStatus !== "lobby") {
      state.audioEvents.clear();
      stopAllAudio();
    }
    render();
    handleRoomAudio();
  });

  clearInterval(state.timer);
  state.timer = setInterval(async () => {
    if (!state.room) return;
    if (state.room.status === "question") {
      if (Date.now() >= state.room.currentQuestionEndsAt) {
        await safely(async () => {
          state.room = await tickRoom(state.room.code);
        });
      }
      render();
      handleRoomAudio();
    }
  }, 500);
}

function handleRoomAudio() {
  const audio = getAudioSettings();
  if (!audio.unlocked || !audio.soundOn || !state.room || !state.currentPlayer) return;

  if (state.room.status === "question" && Date.now() < state.room.currentQuestionStartedAt) {
    const count = Math.max(1, Math.ceil((state.room.currentQuestionStartedAt - Date.now()) / 1000));
    triggerAudioOnce(`${roundAudioKey()}:countdown:${count}`, "countdown");
    return;
  }

  if (state.room.status === "reveal") {
    triggerAudioOnce(`${roundAudioKey()}:reveal`, "reveal");
    const playerResult = getPlayerResult(state.room, state.currentPlayer.id);
    if (playerResult) {
      triggerAudioOnce(
        `${roundAudioKey()}:result:${state.currentPlayer.id}`,
        playerResult.isCorrect ? "correct" : "wrong"
      );
    }
    return;
  }

  if (state.room.status === "leaderboard") {
    triggerAudioOnce(`${roundAudioKey()}:leaderboard`, "leaderboard");
    return;
  }

  if (state.room.status === "finished") {
    triggerAudioOnce(`${state.room.code}:winner:${state.room.selectedQuestionIds.join("-")}`, "winner");
  }
}

function triggerAudioOnce(key, soundName) {
  if (state.audioEvents.has(key)) return;
  state.audioEvents.add(key);
  playSound(soundName);
}

function getCurrentQuestion() {
  return QUESTION_BY_ID[getCurrentQuestionId(state.room)];
}

function displayQuestionText(question) {
  return String(question?.question || "")
    .replace(/^(Quick one|Speed round|No overthinking|Party check|Protect your streak|Fast fingers|For the bragging rights|Room check):\s*/i, "");
}

function getOwnCurrentAnswer() {
  const answer = getCurrentAnswer(state.room, state.currentPlayer?.id);
  const key = answerKey();
  if (!answer && !state.localChoices.has(key)) return null;
  return {
    ...(answer || {}),
    choiceIndex: state.localChoices.has(key) ? state.localChoices.get(key) : answer?.choiceIndex
  };
}

function answerKey(room = state.room, playerId = state.currentPlayer?.id) {
  const questionId = getCurrentQuestionId(room);
  if (!room?.code || !playerId || !questionId) return "";
  return `${room.code}:${room.currentRoundIndex}:${questionId}:${playerId}`;
}

function roundAudioKey() {
  return `${state.room.code}:${state.room.currentRoundIndex}:${getCurrentQuestionId(state.room)}`;
}

function roundPhraseKey() {
  return roundAudioKey();
}

function totalRounds() {
  return state.room?.selectedQuestionIds?.length || state.room?.settings?.roundCount || 0;
}

function playerAnswerLabel(question, result) {
  if (result.choiceIndex === null || result.choiceIndex === undefined) return "No answer";
  const letter = String.fromCharCode(65 + result.choiceIndex);
  return `${letter}: ${question.choices[result.choiceIndex]}`;
}

function isCurrentHost() {
  return state.currentPlayer?.id === state.room?.hostId;
}

function playerName(playerId) {
  return state.room?.players.find((player) => player.id === playerId)?.displayName || "";
}

function isStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, { once: true });
}

async function safely(action) {
  try {
    state.error = "";
    await action();
  } catch (error) {
    state.error = error.message || "Something went wrong.";
  }
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch {
    showToast("Copy did not work in this browser.");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function playerUrl(code, playerId) {
  return `?room=${encodeURIComponent(code)}&player=${encodeURIComponent(playerId)}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
