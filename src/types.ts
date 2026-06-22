export type GameStatus = "lobby" | "question" | "reveal" | "leaderboard" | "finished";

export type TriviaCategory =
  | "Mixed Party"
  | "Geography"
  | "Sports"
  | "Animals"
  | "Movies & TV"
  | "Songs & Music"
  | "Brands & Logos"
  | "Food & Drink"
  | "Internet & Pop Culture"
  | "History"
  | "Science & Nature"
  | "Luxury & Fashion"
  | "Cars"
  | "Football Special";

export type GameMode = "Classic" | "Genius";
export type GeniusCategory = "World History" | "Hollywood" | "Animal Kingdom" | "Brands" | "Geography" | "Sports";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Player = {
  id: string;
  displayName: string;
  joinedAt: number;
};

export type Account = {
  id: string;
  email: string;
  displayName: string;
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  classicWins: number;
  geniusWins: number;
  emailConfirmed: boolean;
};

export type RivalryRecord = {
  accountLow: string;
  lowName: string;
  accountHigh: string;
  highName: string;
  lowWins: number;
  highWins: number;
  draws: number;
  lastWinnerId: string | null;
  lastPlayedAt: string | null;
  streakWinnerId: string | null;
  streakCount: number;
};

export type GameSettings = {
  gameMode: GameMode;
  roundCount: 5 | 10 | 15 | 20 | 30;
  timerSeconds: 10 | 15 | 20;
  pacingMode: "Fast" | "Normal" | "Relaxed";
  categoryMode: TriviaCategory;
};

export type TriviaQuestion = {
  id: string;
  category: Exclude<TriviaCategory, "Mixed Party"> | GeniusCategory;
  difficulty: Difficulty;
  question: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
};

export type PlayerAnswer = {
  playerId: string;
  questionId: string;
  choiceIndex: number;
  answeredAt: number;
  answeredInMs: number;
  timeRemainingMs: number;
};

export type PlayerStats = {
  correctAnswers: number;
  answeredCount: number;
  wrongAnswers: number;
  currentStreak: number;
  longestStreak: number;
  totalCorrectTimeMs: number;
  fastestCorrectCount: number;
  bestRoundGain: number;
};

export type RoundResult = {
  roundIndex: number;
  questionId: string;
  correctIndex: number;
  correctAnswer: string;
  explanation: string;
  answerCounts: number[];
  playerResults: Array<{
    playerId: string;
    choiceIndex: number | null;
    isCorrect: boolean;
    answeredInMs: number | null;
    timeRemainingMs: number;
    basePoints: number;
    speedBonus: number;
    streakBonus: number;
    points: number;
  }>;
  fastestCorrectPlayerId: string | null;
  leaderboard: LeaderboardEntry[];
};

export type LeaderboardEntry = {
  playerId: string;
  displayName: string;
  totalPoints: number;
  correctAnswers: number;
  currentStreak: number;
  longestStreak: number;
  avgCorrectMs: number;
  movement: "up" | "down" | "same";
  rank: number;
};

export type Room = {
  id: string;
  code: string;
  inviteUrl: string;
  hostId: string;
  players: Player[];
  settings: GameSettings;
  status: GameStatus;
  currentRoundIndex: number;
  selectedQuestionIds: string[];
  currentQuestionStartedAt: number | null;
  currentQuestionEndsAt: number | null;
  answers: Record<string, Record<string, PlayerAnswer>>;
  scores: Record<string, number>;
  streaks: Record<string, number>;
  stats: Record<string, PlayerStats>;
  previousLeaderboard: LeaderboardEntry[];
  lastLeaderboard: LeaderboardEntry[];
  roundResults: RoundResult[];
  lobbyReady: Record<string, boolean>;
  nextReady: Record<string, number>;
  presence: Record<string, { connected: boolean; lastSeen: number }>;
  questionReports: Array<{
    playerId: string;
    questionId: string;
    reason: "too_easy" | "wrong_answer" | "repeated" | "unclear";
    roundIndex: number;
    createdAt: number;
  }>;
  rivalries: RivalryRecord[];
  historySaved: boolean;
  createdAt: number;
  updatedAt: number;
};
