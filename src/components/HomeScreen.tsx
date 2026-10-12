'use client';

import React from 'react';
import {
  Flame,
  Award,
  ChevronRight,
  Sparkles,
  Play,
  RotateCcw,
  Zap,
  TrendingUp,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { UserRewardState } from '../types';
import { calculateLevel } from '../lib/rewardEngine';
import { getPast7DaysStatus, isSameDay, getTodayDateString } from '../lib/dateUtils';
import { BADGES } from '../lib/constants';
import { CompletedTodayCard } from './CompletedTodayCard';
import { sounds } from '../lib/sound';

interface HomeScreenProps {
  userState: UserRewardState;
  onStartQuiz: () => void;
  onReviewQuiz: () => void;
  onOpenBadges: () => void;
  onOpenLedger: () => void;
  onSimulateYesterday: () => void;
  onResetData: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userState,
  onStartQuiz,
  onReviewQuiz,
  onOpenBadges,
  onOpenLedger,
  onSimulateYesterday,
  onResetData,
}) => {
  const todayStr = getTodayDateString();
  const isCompletedToday = isSameDay(userState.lastCompletedDate, todayStr);
  const levelInfo = calculateLevel(userState.totalPoints);
  const weekDays = getPast7DaysStatus(userState.completedDates, todayStr);

  return (
    <div className="flex-1 space-y-4 p-4 pb-12 animate-slide-up">
      {/* Level & XP Progress Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-base">
              L{levelInfo.currentTier.level}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Current Level
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                {levelInfo.currentTier.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick(userState.soundEnabled);
              onOpenLedger();
            }}
            className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
          >
            <span>{userState.totalPoints} pts</span>
            <ChevronRight className="h-3.5 w-3.5 text-amber-700" />
          </button>
        </div>

        {/* Progress bar to next level */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
            <span>
              {levelInfo.nextTier
                ? `${levelInfo.pointsToNextLevel} pts to ${levelInfo.nextTier.name}`
                : 'Maximum Tier Achieved! 🏆'}
            </span>
            <span>{levelInfo.progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Streak 7-Day Activity Strip */}
      <div className="rounded-2xl border border-orange-100 bg-gradient-to-b from-orange-50/60 to-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <Flame className="h-4.5 w-4.5 fill-orange-500 text-orange-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {userState.currentStreak > 0
                  ? `${userState.currentStreak}-Day Daily Streak!`
                  : 'Start Your Daily Streak!'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isCompletedToday
                  ? "Today is completed. You're on track!"
                  : 'Do today’s 2-minute quiz to keep the flame alive.'}
              </p>
            </div>
          </div>
          {userState.bestStreak > 0 && (
            <span className="text-[10px] font-medium text-slate-400">
              Best: {userState.bestStreak}d
            </span>
          )}
        </div>

        {/* 7-Day Dots */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {weekDays.map((d) => (
            <div
              key={d.dateStr}
              className={`flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition-all ${
                d.isToday
                  ? 'border-2 border-indigo-500 bg-indigo-50/50'
                  : 'border border-slate-100 bg-slate-50/60'
              }`}
            >
              <span className="text-[10px] font-medium text-slate-400">
                {d.dayLabel}
              </span>
              <div className="my-1 flex h-6 w-6 items-center justify-center">
                {d.isCompleted ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                ) : d.isToday ? (
                  <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-slate-200" />
                )}
              </div>
              <span
                className={`text-[10px] font-bold ${
                  d.isToday ? 'text-indigo-600' : 'text-slate-600'
                }`}
              >
                {d.dayNumber}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Challenge Card */}
      {isCompletedToday ? (
        <CompletedTodayCard
          currentStreak={userState.currentStreak}
          onReviewQuiz={onReviewQuiz}
        />
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 p-5 text-white shadow-lg shadow-indigo-100">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase text-indigo-100 backdrop-blur-sm">
                <Sparkles className="h-3 w-3" /> Today&apos;s Challenge
              </span>
              <span className="text-xs font-medium text-indigo-200">
                5 Questions • ~2 min
              </span>
            </div>

            <h3 className="mt-3 text-xl font-black tracking-tight text-white">
              Digital Safety & Money Smarts
            </h3>
            <p className="mt-1 text-xs text-indigo-100 leading-relaxed">
              Answer 5 simple everyday questions. Learn how to protect your money, save phone data, and earn real points.
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-xs font-black">
                  🪙
                </span>
                <span className="text-xs font-bold text-white">
                  Earn up to +50 Points
                </span>
              </div>
              <span className="text-[11px] text-indigo-200">
                + Streak Bonus
              </span>
            </div>

            {/* Big Thumb-Friendly CTA Button (min 56px height) */}
            <button
              onClick={() => {
                sounds.playClick(userState.soundEnabled);
                onStartQuiz();
              }}
              className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white text-base font-black text-indigo-900 shadow-md transition active:scale-98 hover:bg-slate-50"
            >
              <Play className="h-5 w-5 fill-indigo-900 text-indigo-900" />
              <span>Start Today&apos;s Challenge</span>
            </button>
          </div>
        </div>
      )}

      {/* Badges Preview Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Badges & Milestones
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick(userState.soundEnabled);
              onOpenBadges();
            }}
            className="flex items-center gap-0.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>
              {userState.unlockedBadgeIds.length}/{BADGES.length} Unlocked
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Badges row */}
        <div className="grid grid-cols-3 gap-2">
          {BADGES.slice(0, 3).map((badge) => {
            const isUnlocked = userState.unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                onClick={onOpenBadges}
                className={`cursor-pointer rounded-xl p-2.5 text-center border transition ${
                  isUnlocked
                    ? 'border-amber-200 bg-amber-50/70'
                    : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                <div className="text-2xl">{badge.icon}</div>
                <p className="mt-1 text-xs font-bold text-slate-900 truncate">
                  {badge.title}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {isUnlocked ? 'Unlocked' : `+${badge.pointsReward} pts`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evaluator / Reviewer Sandbox Controls */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3.5 text-xs text-slate-600">
        <div className="flex items-center justify-between mb-1.5 font-bold text-slate-800">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-600" />
            <span>Kenpath Reviewer Sandbox</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">
            Testing Tools
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-normal mb-3">
          To test how the streak increments or resets without waiting 24 hours, use the quick shortcuts below:
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSimulateYesterday}
            className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-center text-[11px] font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition"
            title="Simulate that you completed yesterday's challenge, so today's completion will increment streak to 3!"
          >
            <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
            <span>Set Last Day = Yesterday</span>
          </button>

          <button
            onClick={onResetData}
            className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-center text-[11px] font-semibold text-rose-600 hover:bg-rose-50 active:scale-95 transition"
            title="Clear all stored points and badges to test fresh onboarding"
          >
            <RotateCcw className="h-3.5 w-3.5 text-rose-500" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
