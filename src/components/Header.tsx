'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Flame, Volume2, VolumeX, WifiOff, Coins } from 'lucide-react';
import { sounds } from '../lib/sound';

interface HeaderProps {
  totalPoints: number;
  currentStreak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLedger: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalPoints,
  currentStreak,
  soundEnabled,
  onToggleSound,
  onOpenLedger,
}) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-sm shadow-indigo-200">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            Daily<span className="text-indigo-600">Spark</span>
          </span>
          {!isOnline && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-amber-600">
              <WifiOff className="h-2.5 w-2.5" />
              <span>Offline (Local)</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          title={`Current Streak: ${currentStreak} days`}
          className={`flex h-9 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
            currentStreak > 0
              ? 'bg-orange-50 text-orange-600 border border-orange-200'
              : 'bg-slate-100 text-slate-400 border border-slate-200'
          }`}
        >
          <Flame
            className={`h-4 w-4 ${
              currentStreak > 0 ? 'fill-orange-500 text-orange-500' : 'text-slate-400'
            }`}
          />
          <span>{currentStreak}d</span>
        </div>

        <button
          onClick={() => {
            sounds.playClick(soundEnabled);
            onOpenLedger();
          }}
          className="flex h-9 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 transition active:scale-95 hover:bg-amber-100"
          aria-label="View points ledger and reward balance"
        >
          <Coins className="h-4 w-4 fill-amber-500 text-amber-500" />
          <span>{totalPoints}</span>
        </button>

        <button
          onClick={() => {
            onToggleSound();
            sounds.playClick(!soundEnabled);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition active:scale-95 hover:bg-slate-100"
          aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4 text-indigo-600" />
          ) : (
            <VolumeX className="h-4 w-4 text-slate-400" />
          )}
        </button>
      </div>
    </header>
  );
};
