export const PHRASES = {
  landingSubtitle: [
    "Create a room, invite your friends, and race to the top.",
    "Trivia for parties, pre-drinks, game nights, and competitive friends.",
    "One room code. Fast answers. Loud opinions.",
    "Your phone is the buzzer. Your friends are the problem."
  ],
  landingHelper: [
    "Sign in. Join the room. Keep the rivalry forever.",
    "Bring friends. Protect your reputation.",
    "Two minutes to start. Bragging rights forever.",
    "Low setup. High drama."
  ],
  lobbyHelper: [
    "Waiting for the squad.",
    "More players, more drama.",
    "The room is warming up.",
    "Someone is already planning their victory speech.",
    "Invite the friend who claims they know everything."
  ],
  waitingForHost: [
    "Waiting for the host to start the chaos.",
    "The host is setting the battlefield.",
    "Hold tight. The button belongs to the host.",
    "Warm up your thumbs. The host is in charge.",
    "The room is loaded. The host has the keys."
  ],
  countdown: [
    "Hands ready.",
    "Eyes up.",
    "Speed matters.",
    "Think fast.",
    "Big points loading.",
    "Next one starts now."
  ],
  questionHelper: [
    "Tap once. It locks.",
    "Pick fast. Points like speed.",
    "One answer. No edits.",
    "Trust the first good guess.",
    "Answer before the bar disappears."
  ],
  answerLocked: [
    "Locked in.",
    "No regrets.",
    "Answer locked.",
    "Submitted.",
    "Final answer."
  ],
  waitingAfterAnswer: [
    "Waiting for the room.",
    "Reveal coming.",
    "The timer is still alive.",
    "Let the suspense work.",
    "No changes now."
  ],
  reveal: [
    "Truth time.",
    "Let's see who cooked.",
    "This one might hurt.",
    "Someone is about to celebrate.",
    "The room is about to get loud."
  ],
  correctReveal: [
    "You got it.",
    "Clean hit.",
    "That was sharp.",
    "Someone knew that way too fast.",
    "Genius or luck? We accept both."
  ],
  wrongReveal: [
    "Not this time.",
    "Wrong answers build character.",
    "The group chat will remember this.",
    "Bold choice. Incorrect, but bold.",
    "That confidence was expensive."
  ],
  leaderboard: [
    "Leaderboard drama incoming.",
    "The table has shifted.",
    "Positions are not guaranteed.",
    "The room is getting competitive.",
    "This leaderboard has feelings now."
  ],
  leadChange: [
    "New leader. New pressure.",
    "The crown has changed hands.",
    "That comeback was personal.",
    "Somebody just got chased down.",
    "The top spot is not safe."
  ],
  final: [
    "The winner has been decided.",
    "The room has spoken.",
    "Crown secured.",
    "Final scores. Maximum opinions.",
    "The scoreboard is now evidence."
  ],
  winner: [
    "Fast fingers. Big points. Permanent bragging rights.",
    "Winner energy confirmed.",
    "Screenshot this before anyone argues.",
    "Tonight's trivia crown has an owner.",
    "The victory speech starts now."
  ],
  errorHelper: [
    "Tiny problem. Easy fix.",
    "That did not land. Try again.",
    "The room said no, but politely.",
    "Quick reset, then back to chaos.",
    "Something tripped. Nothing dramatic."
  ]
};

const phraseState = new Map();
const phraseCache = new Map();

export function getPhrase(context, key = "default") {
  const cacheKey = `${context}:${key}`;
  if (phraseCache.has(cacheKey)) return phraseCache.get(cacheKey);

  const options = PHRASES[context] || [""];
  const state = phraseState.get(context) || { last: "", bag: [] };
  if (!state.bag.length) state.bag = shuffle(options);

  let phrase = state.bag.shift() || options[0];
  if (phrase === state.last && options.length > 1) {
    state.bag.push(phrase);
    phrase = state.bag.shift() || options.find((option) => option !== state.last) || phrase;
  }

  state.last = phrase;
  phraseState.set(context, state);
  phraseCache.set(cacheKey, phrase);
  return phrase;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
