import { describe, it, expect } from 'vitest';
import {
  calculateStreakUpdate,
  calculateLevel,
  checkNewlyUnlockedBadges,
  processQuizCompletion,
  INITIAL_USER_STATE,
} from '../lib/rewardEngine';
import { BADGES } from '../lib/constants';

describe('Streak Calculation', () => {
  it('initializes streak to 1 on first completion', () => {
    const res = calculateStreakUpdate(null, '2026-10-12', 0);
    expect(res.newStreak).toBe(1);
    expect(res.streakMaintained).toBe(true);
  });

  it('keeps streak identical if completed again on the same day', () => {
    const res = calculateStreakUpdate('2026-10-12', '2026-10-12', 4);
    expect(res.newStreak).toBe(4);
    expect(res.streakMaintained).toBe(true);
  });

  it('increments streak by 1 if completed on consecutive day (yesterday)', () => {
    const res = calculateStreakUpdate('2026-10-11', '2026-10-12', 2);
    expect(res.newStreak).toBe(3);
    expect(res.streakMaintained).toBe(true);
  });

  it('resets streak to 1 if more than 1 day was missed', () => {
    const res = calculateStreakUpdate('2026-10-09', '2026-10-12', 5);
    expect(res.newStreak).toBe(1);
    expect(res.streakMaintained).toBe(false);
  });
});

describe('Level Calculation', () => {
  it('correctly maps 0 points to Level 1 Novice', () => {
    const level = calculateLevel(0);
    expect(level.currentTier.level).toBe(1);
    expect(level.currentTier.name).toBe('Novice');
    expect(level.progressPercent).toBe(0);
    expect(level.pointsToNextLevel).toBe(50);
  });

  it('correctly calculates progress midway through tier', () => {
    const level = calculateLevel(25);
    expect(level.currentTier.level).toBe(1);
    expect(level.progressPercent).toBe(50);
    expect(level.pointsToNextLevel).toBe(25);
  });

  it('progresses to Level 2 Explorer at 50 points', () => {
    const level = calculateLevel(75);
    expect(level.currentTier.level).toBe(2);
    expect(level.currentTier.name).toBe('Explorer');
    // Tier 2 is 50 to 150 (span 100). 75 - 50 = 25 points -> 25%
    expect(level.progressPercent).toBe(25);
  });
});

describe('Badge Qualification', () => {
  it('unlocks First Spark and Sharp Mind on first 5/5 score', () => {
    const unlocked = checkNewlyUnlockedBadges([], {
      totalPointsAfterQuiz: 50,
      newStreak: 1,
      score: 5,
      totalQuestions: 5,
      totalChallengesCompleted: 1,
    });

    const badgeIds = unlocked.map((b) => b.id);
    expect(badgeIds).toContain('first_spark');
    expect(badgeIds).toContain('perfect_score');
  });

  it('does not re-unlock already unlocked badges', () => {
    const unlocked = checkNewlyUnlockedBadges(['first_spark', 'perfect_score'], {
      totalPointsAfterQuiz: 50,
      newStreak: 1,
      score: 5,
      totalQuestions: 5,
      totalChallengesCompleted: 2,
    });

    expect(unlocked).toEqual([]);
  });

  it('unlocks 3-day streak badge when hitting streak of 3', () => {
    const unlocked = checkNewlyUnlockedBadges(['first_spark'], {
      totalPointsAfterQuiz: 80,
      newStreak: 3,
      score: 4,
      totalQuestions: 5,
      totalChallengesCompleted: 3,
    });

    const badgeIds = unlocked.map((b) => b.id);
    expect(badgeIds).toContain('streak_3');
  });
});

describe('processQuizCompletion Workflow', () => {
  it('awards base points and unlocks badges for brand new user', () => {
    const { updatedState, result } = processQuizCompletion(
      INITIAL_USER_STATE,
      '2026-10-12',
      5,
      5
    );

    expect(result.alreadyCompletedToday).toBe(false);
    expect(result.score).toBe(5);
    // Base points = 5 * 10 = 50
    // Badges unlocked: first_spark (10) + perfect_score (15) = 25
    // Total earned = 75
    expect(result.pointsEarned).toBe(75);
    expect(updatedState.totalPoints).toBe(75);
    expect(updatedState.currentStreak).toBe(1);
    expect(updatedState.lastCompletedDate).toBe('2026-10-12');
    expect(updatedState.completedDates).toContain('2026-10-12');
    expect(updatedState.unlockedBadgeIds).toContain('first_spark');
    expect(updatedState.unlockedBadgeIds).toContain('perfect_score');
    expect(updatedState.history.length).toBeGreaterThanOrEqual(2);
  });

  it('prevents duplicate completions and awards zero points if re-attempted today', () => {
    const stateWithTodayDone = {
      ...INITIAL_USER_STATE,
      totalPoints: 100,
      currentStreak: 2,
      lastCompletedDate: '2026-10-12',
      completedDates: ['2026-10-12'],
    };

    const { updatedState, result } = processQuizCompletion(
      stateWithTodayDone,
      '2026-10-12',
      5,
      5
    );

    expect(result.alreadyCompletedToday).toBe(true);
    expect(result.pointsEarned).toBe(0);
    expect(updatedState.totalPoints).toBe(100);
    expect(updatedState.currentStreak).toBe(2);
  });

  it('grants milestone streak bonus (+20 pts) on 3rd consecutive day', () => {
    const userAtStreak2 = {
      ...INITIAL_USER_STATE,
      totalPoints: 80,
      currentStreak: 2,
      lastCompletedDate: '2026-10-11', // Yesterday
      completedDates: ['2026-10-10', '2026-10-11'],
      unlockedBadgeIds: ['first_spark'],
    };

    const { updatedState, result } = processQuizCompletion(
      userAtStreak2,
      '2026-10-12',
      4,
      5
    );

    expect(result.newStreak).toBe(3);
    expect(result.streakBonus).toBe(20);
    // Base points: 4 * 10 = 40
    // Streak milestone bonus: 20
    // Badge unlocked: streak_3 (+20 pts)
    // Badge unlocked: points_100 (+25 pts, since total crossed 100)
    // Points earned = 40 + 20 + 20 + 25 = 105 pts
    expect(result.pointsEarned).toBe(105);
    expect(updatedState.totalPoints).toBe(80 + 105);
    expect(updatedState.currentStreak).toBe(3);
    expect(updatedState.unlockedBadgeIds).toContain('streak_3');
    expect(updatedState.unlockedBadgeIds).toContain('points_100');
  });
});
