import {
  UserRewardState,
  Badge,
  RewardHistoryItem,
  QuizSubmissionResult,
} from '../types';
import {
  POINTS_PER_CORRECT_ANSWER,
  LEVEL_TIERS,
  BADGES,
  STREAK_BONUSES,
} from './constants';
import { isConsecutiveDay, isSameDay } from './dateUtils';

export function calculateLevel(points: number): {
  currentTier: (typeof LEVEL_TIERS)[number];
  nextTier: (typeof LEVEL_TIERS)[number] | null;
  progressPercent: number;
  pointsToNextLevel: number;
} {
  let currentTier = LEVEL_TIERS[0];
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_TIERS[i].minPoints) {
      currentTier = LEVEL_TIERS[i];
      break;
    }
  }

  const currentIndex = LEVEL_TIERS.findIndex((t) => t.level === currentTier.level);
  const nextTier = currentIndex < LEVEL_TIERS.length - 1 ? LEVEL_TIERS[currentIndex + 1] : null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      pointsToNextLevel: 0,
    };
  }

  const tierSpan = nextTier.minPoints - currentTier.minPoints;
  const pointsInCurrentTier = points - currentTier.minPoints;
  const progressPercent = Math.min(100, Math.max(0, Math.round((pointsInCurrentTier / tierSpan) * 100)));
  const pointsToNextLevel = Math.max(0, nextTier.minPoints - points);

  return {
    currentTier,
    nextTier,
    progressPercent,
    pointsToNextLevel,
  };
}

export function calculateStreakUpdate(
  lastCompletedDate: string | null,
  currentDateStr: string,
  currentStreak: number
): { newStreak: number; streakMaintained: boolean } {
  if (!lastCompletedDate) {
    return { newStreak: 1, streakMaintained: true };
  }

  if (isSameDay(lastCompletedDate, currentDateStr)) {
    return { newStreak: currentStreak, streakMaintained: true };
  }

  if (isConsecutiveDay(lastCompletedDate, currentDateStr)) {
    return { newStreak: currentStreak + 1, streakMaintained: true };
  }

  return { newStreak: 1, streakMaintained: false };
}

export function checkNewlyUnlockedBadges(
  currentlyUnlockedIds: string[],
  context: {
    totalPointsAfterQuiz: number;
    newStreak: number;
    score: number;
    totalQuestions: number;
    totalChallengesCompleted: number;
  }
): Badge[] {
  const newlyUnlocked: Badge[] = [];

  for (const badge of BADGES) {
    if (currentlyUnlockedIds.includes(badge.id)) continue;

    let qualifies = false;
    switch (badge.id) {
      case 'first_spark':
        qualifies = context.totalChallengesCompleted >= 1;
        break;
      case 'perfect_score':
        qualifies = context.score === context.totalQuestions && context.totalQuestions > 0;
        break;
      case 'streak_3':
        qualifies = context.newStreak >= 3;
        break;
      case 'streak_7':
        qualifies = context.newStreak >= 7;
        break;
      case 'points_100':
        qualifies = context.totalPointsAfterQuiz >= 100;
        break;
      case 'points_250':
        qualifies = context.totalPointsAfterQuiz >= 250;
        break;
    }

    if (qualifies) {
      newlyUnlocked.push(badge);
    }
  }

  return newlyUnlocked;
}

export function processQuizCompletion(
  state: UserRewardState,
  todayDateStr: string,
  score: number,
  totalQuestions: number
): {
  updatedState: UserRewardState;
  result: QuizSubmissionResult;
} {
  if (state.lastCompletedDate && isSameDay(state.lastCompletedDate, todayDateStr)) {
    return {
      updatedState: state,
      result: {
        score,
        totalQuestions,
        pointsEarned: 0,
        streakBonus: 0,
        newStreak: state.currentStreak,
        newBadges: [],
        alreadyCompletedToday: true,
      },
    };
  }

  const { newStreak } = calculateStreakUpdate(
    state.lastCompletedDate,
    todayDateStr,
    state.currentStreak
  );
  const bestStreak = Math.max(state.bestStreak, newStreak);

  const basePoints = score * POINTS_PER_CORRECT_ANSWER;

  let streakBonus = 0;
  if (newStreak === 3) {
    streakBonus = STREAK_BONUSES[3];
  } else if (newStreak === 7) {
    streakBonus = STREAK_BONUSES[7];
  }

  let runningPoints = state.totalPoints + basePoints + streakBonus;
  const newCompletedDates = Array.from(new Set([...state.completedDates, todayDateStr])).sort();
  const totalCompletedCount = newCompletedDates.length;

  const newBadges = checkNewlyUnlockedBadges(state.unlockedBadgeIds, {
    totalPointsAfterQuiz: runningPoints,
    newStreak,
    score,
    totalQuestions,
    totalChallengesCompleted: totalCompletedCount,
  });

  const badgePoints = newBadges.reduce((sum, b) => sum + b.pointsReward, 0);
  const totalPoints = runningPoints + badgePoints;
  const totalEarnedInSession = basePoints + streakBonus + badgePoints;

  const nowIso = new Date().toISOString();
  const newHistoryItems: RewardHistoryItem[] = [];

  if (basePoints > 0) {
    newHistoryItems.push({
      id: `quiz-${todayDateStr}-${Date.now()}`,
      date: nowIso,
      displayDate: todayDateStr,
      title: `Daily Challenge (${score}/${totalQuestions} correct)`,
      points: basePoints,
      type: 'daily_quiz',
    });
  }

  if (streakBonus > 0) {
    newHistoryItems.push({
      id: `streak-${newStreak}-${Date.now()}`,
      date: nowIso,
      displayDate: todayDateStr,
      title: `Streak Milestone (${newStreak} Days 🔥)`,
      points: streakBonus,
      type: 'streak_bonus',
    });
  }

  for (const badge of newBadges) {
    newHistoryItems.push({
      id: `badge-${badge.id}-${Date.now()}`,
      date: nowIso,
      displayDate: todayDateStr,
      title: `Badge Unlocked: ${badge.title} ${badge.icon}`,
      points: badge.pointsReward,
      type: 'badge_reward',
    });
  }

  const updatedState: UserRewardState = {
    ...state,
    totalPoints,
    currentStreak: newStreak,
    bestStreak,
    lastCompletedDate: todayDateStr,
    completedDates: newCompletedDates,
    unlockedBadgeIds: Array.from(new Set([...state.unlockedBadgeIds, ...newBadges.map((b) => b.id)])),
    history: [...newHistoryItems, ...state.history],
  };

  const result: QuizSubmissionResult = {
    score,
    totalQuestions,
    pointsEarned: totalEarnedInSession,
    streakBonus,
    newStreak,
    newBadges,
    alreadyCompletedToday: false,
  };

  return { updatedState, result };
}

export const INITIAL_USER_STATE: UserRewardState = {
  version: 1,
  totalPoints: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastCompletedDate: null,
  completedDates: [],
  unlockedBadgeIds: [],
  history: [],
  soundEnabled: true,
};
