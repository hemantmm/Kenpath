'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  Coins,
} from 'lucide-react';
import { QuizSubmissionResult, Badge } from '../types';
import { POINTS_TO_USD_RATIO } from '../lib/constants';
import { sounds } from '../lib/sound';

interface ResultsScreenProps {
  result: QuizSubmissionResult;
  soundEnabled: boolean;
  onFinish: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  soundEnabled,
  onFinish,
}) => {
  useEffect(() => {
    sounds.playCelebration(soundEnabled);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#f59e0b', '#10b981', '#f97316'],
      });
    } catch {
      // Confetti fallback safely ignored
    }
  }, [soundEnabled]);

  const isPerfect = result.score === result.totalQuestions;
  const estimatedUsd = (result.pointsEarned * POINTS_TO_USD_RATIO).toFixed(3);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 p-4 pb-24 animate-scale-in">
      <div className="mt-4 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-200 animate-pulse-glow">
          <Trophy className="h-10 w-10" />
        </div>

        <span className="mt-3 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          {isPerfect ? '🌟 Perfect Score!' : 'Well Done!'}
        </span>

        <h1 className="mt-2 text-2xl font-black text-slate-900">
          Challenge Complete!
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          You answered {result.score} of {result.totalQuestions} questions correctly.
        </p>
      </div>

      <div className="mt-6 rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50/80 to-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Simulated Points Earned
            </span>
          </div>
          <span className="text-xs font-bold text-amber-900">
            ≈ ${estimatedUsd} USD (simulated)
          </span>
        </div>

        <div className="my-3 flex items-baseline gap-2">
          <span className="text-4xl font-black tracking-tight text-amber-950">
            +{result.pointsEarned}
          </span>
          <span className="text-base font-bold text-amber-800">Points</span>
        </div>

        <div className="space-y-2 border-t border-amber-200/60 pt-3 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Quiz Questions ({result.score} correct)</span>
            <span className="font-bold text-slate-900">
              +{result.score * 10} pts
            </span>
          </div>

          {result.streakBonus > 0 && (
            <div className="flex justify-between text-orange-700">
              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                Streak Milestone Bonus
              </span>
              <span className="font-bold">+{result.streakBonus} pts</span>
            </div>
          )}

          {result.newBadges.map((badge) => (
            <div key={badge.id} className="flex justify-between text-indigo-700">
              <span className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5" />
                Badge Reward: {badge.title} {badge.icon}
              </span>
              <span className="font-bold">+{badge.pointsReward} pts</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Flame className="h-5 w-5 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-orange-950">
              {result.newStreak}-Day Streak Active!
            </h4>
            <p className="text-[11px] text-orange-800/80">
              Your daily habit is growing. Come back tomorrow!
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-orange-600 shadow-xs">
          {result.newStreak}d 🔥
        </span>
      </div>

      {result.newBadges.length > 0 && (
        <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
          <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900 mb-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Badges Unlocked in This Session!</span>
          </div>
          <div className="space-y-2">
            {result.newBadges.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-xs border border-indigo-100"
              >
                <span className="text-2xl">{b.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">{b.title}</p>
                  <p className="text-[11px] text-slate-500">{b.description}</p>
                </div>
                <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                  +{b.pointsReward} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-md">
          <button
            onClick={() => {
              sounds.playClick(soundEnabled);
              onFinish();
            }}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-base font-bold text-white shadow-md shadow-indigo-200 transition active:scale-98 hover:bg-indigo-700"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
