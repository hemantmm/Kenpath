export interface Question {
  id: string;
  category: string;
  categoryIcon?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DailyQuiz {
  date: string;
  title: string;
  topic: string;
  description: string;
  questions: Question[];
}

export type RewardType = 'daily_quiz' | 'streak_bonus' | 'badge_reward';

export interface RewardHistoryItem {
  id: string;
  date: string;
  displayDate: string;
  title: string;
  points: number;
  type: RewardType;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsReward: number;
  conditionDescription: string;
}

export interface UserRewardState {
  version: number;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null;
  completedDates: string[];
  unlockedBadgeIds: string[];
  history: RewardHistoryItem[];
  soundEnabled: boolean;
}

export interface QuizSubmissionResult {
  score: number;
  totalQuestions: number;
  pointsEarned: number;
  streakBonus: number;
  newStreak: number;
  newBadges: Badge[];
  alreadyCompletedToday: boolean;
}
