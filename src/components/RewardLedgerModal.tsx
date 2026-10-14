'use client';

import React from 'react';
import { X, Coins, ShieldCheck, History, Info } from 'lucide-react';
import { RewardHistoryItem } from '../types';
import { POINTS_TO_USD_RATIO, MIN_PAYOUT_POINTS } from '../lib/constants';

interface RewardLedgerModalProps {
  totalPoints: number;
  history: RewardHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const RewardLedgerModal: React.FC<RewardLedgerModalProps> = ({
  totalPoints,
  history,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const estimatedUsd = (totalPoints * POINTS_TO_USD_RATIO).toFixed(2);
  const payoutProgress = Math.min(100, Math.round((totalPoints / MIN_PAYOUT_POINTS) * 100));
  const pointsRemainingForPayout = Math.max(0, MIN_PAYOUT_POINTS - totalPoints);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white p-5 shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ledger-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Coins className="h-5 w-5 fill-amber-500" />
            </div>
            <div>
              <h2 id="ledger-modal-title" className="text-base font-bold text-slate-900">
                Simulated Rewards & Activity View
              </h2>
              <p className="text-xs text-slate-500">Illustrative point balances & history</p>
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

        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 p-2.5 text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            <Info className="h-3.5 w-3.5 text-amber-700" />
            <span>Prototype Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900/80">
            Points and values shown in this demo are purely illustrative. Payouts are not enabled and points have no real monetary value.
          </p>
        </div>

        <div className="my-3 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-4 text-white shadow-md shadow-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">
              Simulated Balance
            </span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm">
              100 pts ≈ $0.10 USD (illustrative)
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight">{totalPoints}</span>
            <span className="text-base font-medium text-amber-100">Points</span>
            <span className="ml-auto text-xl font-bold">≈ ${estimatedUsd} USD</span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between text-xs font-medium text-amber-100 mb-1">
              <span>Simulated milestone ({MIN_PAYOUT_POINTS} pts)</span>
              <span>{payoutProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${payoutProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-100 mt-1.5">
              {totalPoints >= MIN_PAYOUT_POINTS
                ? '🎉 Milestone reached in this demonstration!'
                : `${pointsRemainingForPayout} more points to reach the illustrative 500-point tier.`}
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-950">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <span>Production Architecture Note</span>
          </div>
          <p className="leading-relaxed text-indigo-900/80">
            This demo stores activity in client-side storage. In a production system at Kenpath Labs, all answers are scored on the server, duplicate completions are prevented via database constraints on <code>(user_id, quiz_date)</code>, and balances are recorded in a server-authoritative double-entry ledger before payout processing.
          </p>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <History className="h-3.5 w-3.5 text-slate-500" />
            <span>Session Activity Log</span>
          </div>
          <span className="text-[11px] text-slate-400">{history.length} events</span>
        </div>

        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
            No events recorded yet. Complete today&apos;s challenge to record your first simulated earnings!
          </div>
        ) : (
          <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.displayDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600">
                    +{item.points} pts
                  </span>
                  <p className="text-[10px] text-slate-400">
                    ≈ +${(item.points * POINTS_TO_USD_RATIO).toFixed(3)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition active:scale-98 hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
