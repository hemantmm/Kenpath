'use client';

import React from 'react';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';
import { BADGES } from '../lib/constants';

interface BadgesModalProps {
  unlockedBadgeIds: string[];
  currentStreak: number;
  totalPoints: number;
  isOpen: boolean;
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  unlockedBadgeIds,
  currentStreak,
  totalPoints,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white p-5 shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="badges-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 id="badges-modal-title" className="text-base font-bold text-slate-900">
                Your Badges & Achievements
              </h2>
              <p className="text-xs text-slate-500">
                {unlockedBadgeIds.length} of {BADGES.length} unlocked
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 gap-3 py-4">
          {BADGES.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`flex items-center gap-3.5 rounded-xl p-3 border transition-all ${
                  isUnlocked
                    ? 'border-amber-200 bg-amber-50/60 shadow-sm'
                    : 'border-slate-200 bg-slate-50/70 opacity-75'
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm ${
                    isUnlocked
                      ? 'bg-amber-100 border border-amber-300'
                      : 'bg-slate-200/80 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                {/* Badge Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm text-slate-900 truncate">
                      {badge.title}
                    </h3>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                        <Lock className="h-2.5 w-2.5" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    🎯 {badge.conditionDescription}
                  </p>
                </div>

                {/* Points Reward Tag */}
                <div className="shrink-0 text-right">
                  <span
                    className={`inline-block rounded-lg px-2 py-1 text-xs font-bold ${
                      isUnlocked
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    +{badge.pointsReward} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition active:scale-98 hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
