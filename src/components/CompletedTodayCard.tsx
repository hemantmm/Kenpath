'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, RotateCcw, Flame, Sparkles } from 'lucide-react';
import { getTimeUntilMidnight } from '../lib/dateUtils';

interface CompletedTodayCardProps {
  currentStreak: number;
  onReviewQuiz: () => void;
}

export const CompletedTodayCard: React.FC<CompletedTodayCardProps> = ({
  currentStreak,
  onReviewQuiz,
}) => {
  const [timeLeft, setTimeLeft] = useState<{ formatted: string }>({ formatted: '--h --m --s' });

  useEffect(() => {
    setTimeLeft(getTimeUntilMidnight());
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-200">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Goal Achieved
            </span>
          </div>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Today&apos;s Challenge Complete!
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            You completed today&apos;s tasks and claimed your points. Great job building your habit!
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-100/70 p-3 text-xs text-emerald-900 font-medium">
        <div className="flex items-center gap-1.5">
          <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
          <span>Streak Protected: <strong>{currentStreak} Days</strong></span>
        </div>
        <span className="text-emerald-700 font-semibold">Active</span>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <Clock className="h-4 w-4 text-indigo-600" />
          <span>Next Challenge in:</span>
        </div>
        <span className="font-mono text-sm font-bold text-slate-900">
          {timeLeft.formatted}
        </span>
      </div>

      <div className="mt-4 pt-2">
        <button
          onClick={onReviewQuiz}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-98"
        >
          <RotateCcw className="h-4 w-4 text-slate-500" />
          <span>Review Questions (Practice Mode)</span>
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-1.5">
          Practice mode does not award extra points to prevent duplicate reward farming.
        </p>
      </div>
    </div>
  );
};
