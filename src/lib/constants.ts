import { Badge } from '../types';

export const POINTS_PER_CORRECT_ANSWER = 10;
export const TOTAL_QUESTIONS_PER_CHALLENGE = 5;

// Monetary conversion simulation
export const POINTS_TO_USD_RATIO = 0.001; // 100 points = $0.10 USD
export const MIN_PAYOUT_POINTS = 500; // $0.50 minimum payout threshold

export const LEVEL_TIERS = [
  { level: 1, name: 'Novice', minPoints: 0, maxPoints: 50 },
  { level: 2, name: 'Explorer', minPoints: 50, maxPoints: 150 },
  { level: 3, name: 'Achiever', minPoints: 150, maxPoints: 300 },
  { level: 4, name: 'Champion', minPoints: 300, maxPoints: 500 },
  { level: 5, name: 'Master', minPoints: 500, maxPoints: 1000 },
];

export const BADGES: Badge[] = [
  {
    id: 'first_spark',
    title: 'First Spark',
    description: 'Finished your first daily challenge.',
    conditionDescription: 'Complete 1 daily challenge',
    icon: '⚡',
    pointsReward: 10,
  },
  {
    id: 'perfect_score',
    title: 'Sharp Mind',
    description: 'Answered all 5 questions correctly.',
    conditionDescription: 'Get 5 out of 5 on any quiz',
    icon: '🎯',
    pointsReward: 15,
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Maintained a 3-day daily streak.',
    conditionDescription: 'Reach a 3-day streak',
    icon: '🔥',
    pointsReward: 20,
  },
  {
    id: 'points_100',
    title: 'Century Club',
    description: 'Earned 100 total reward points.',
    conditionDescription: 'Accumulate 100 points',
    icon: '🪙',
    pointsReward: 25,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Completed 7 days in a row.',
    conditionDescription: 'Reach a 7-day streak',
    icon: '👑',
    pointsReward: 50,
  },
  {
    id: 'points_250',
    title: 'High Earner',
    description: 'Reached 250 total reward points.',
    conditionDescription: 'Accumulate 250 points',
    icon: '💎',
    pointsReward: 50,
  },
];

export const STREAK_BONUSES = {
  3: 20,
  7: 50,
};
