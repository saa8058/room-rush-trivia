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

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Player = {
  id: string;
  displayName: string;
  joinedAt: number;
};

export type GameSettings = {
  roundCount: 5 | 10 | 15 | 20 | 30;
  timerSeconds: 10 | 15 | 20 | 30;
  categoryMode: TriviaCategory;
};

export type TriviaQuestion = {
  id: string;
  category: Exclude<TriviaCategory, "Mixed Party">;
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
  createdAt: number;
  updatedAt: number;
};
