'use client';

import React, { useState, useEffect } from 'react';
import { UserRewardState, QuizSubmissionResult } from '../types';
import {
  loadUserState,
  saveUserState,
  resetUserState,
  simulateYesterdayCompletion,
} from '../lib/storage';
import { processQuizCompletion, INITIAL_USER_STATE } from '../lib/rewardEngine';
import { getTodayDateString } from '../lib/dateUtils';
import { getDailyQuizForDate } from '../data/quizzes';
import { Header } from '../components/Header';
import { HomeScreen } from '../components/HomeScreen';
import { QuizScreen } from '../components/QuizScreen';
import { ResultsScreen } from '../components/ResultsScreen';
import { BadgesModal } from '../components/BadgesModal';
import { RewardLedgerModal } from '../components/RewardLedgerModal';

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [userState, setUserState] = useState<UserRewardState>(INITIAL_USER_STATE);
  const [view, setView] = useState<'home' | 'quiz' | 'results'>('home');
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [lastResult, setLastResult] = useState<QuizSubmissionResult | null>(null);

  // Modals
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [ledgerOpen, setLedgerOpen] = useState(false);

  // Hydrate on mount
  useEffect(() => {
    const loaded = loadUserState();
    setUserState(loaded);
    setMounted(true);
  }, []);

  const handleToggleSound = () => {
    const updated = { ...userState, soundEnabled: !userState.soundEnabled };
    setUserState(updated);
    saveUserState(updated);
  };

  const handleStartQuiz = () => {
    setIsPracticeMode(false);
    setView('quiz');
  };

  const handleReviewQuiz = () => {
    setIsPracticeMode(true);
    setView('quiz');
  };

  const handleQuizComplete = (score: number) => {
    const todayStr = getTodayDateString();
    const currentQuiz = getDailyQuizForDate(todayStr);

    if (isPracticeMode) {
      // In practice mode, we just return home without changing points
      setView('home');
      return;
    }

    const { updatedState, result } = processQuizCompletion(
      userState,
      todayStr,
      score,
      currentQuiz.questions.length
    );

    setUserState(updatedState);
    saveUserState(updatedState);
    setLastResult(result);
    setView('results');
  };

  const handleSimulateYesterday = () => {
    // Sets last completed date to yesterday so user can test the streak increment immediately!
    const simulated = simulateYesterdayCompletion(2);
    setUserState(simulated);
  };

  const handleResetData = () => {
    if (confirm('Reset all points, streaks, and badges to default?')) {
      const reset = resetUserState();
      setUserState(reset);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          <span className="text-xs font-medium text-slate-500">Loading DailySpark...</span>
        </div>
      </div>
    );
  }

  const todayStr = getTodayDateString();
  const currentQuiz = getDailyQuizForDate(todayStr);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Persistent Header */}
      {view !== 'quiz' && (
        <Header
          totalPoints={userState.totalPoints}
          currentStreak={userState.currentStreak}
          soundEnabled={userState.soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenLedger={() => setLedgerOpen(true)}
        />
      )}

      {/* Main Views */}
      <main className="flex-1 flex flex-col">
        {view === 'home' && (
          <HomeScreen
            userState={userState}
            onStartQuiz={handleStartQuiz}
            onReviewQuiz={handleReviewQuiz}
            onOpenBadges={() => setBadgesOpen(true)}
            onOpenLedger={() => setLedgerOpen(true)}
            onSimulateYesterday={handleSimulateYesterday}
            onResetData={handleResetData}
          />
        )}

        {view === 'quiz' && (
          <QuizScreen
            questions={currentQuiz.questions}
            soundEnabled={userState.soundEnabled}
            isPracticeMode={isPracticeMode}
            onComplete={handleQuizComplete}
            onExit={() => setView('home')}
          />
        )}

        {view === 'results' && lastResult && (
          <ResultsScreen
            result={lastResult}
            soundEnabled={userState.soundEnabled}
            onFinish={() => setView('home')}
          />
        )}
      </main>

      {/* Badges Modal */}
      <BadgesModal
        unlockedBadgeIds={userState.unlockedBadgeIds}
        currentStreak={userState.currentStreak}
        totalPoints={userState.totalPoints}
        isOpen={badgesOpen}
        onClose={() => setBadgesOpen(false)}
      />

      {/* Reward Ledger & Real Money Modal */}
      <RewardLedgerModal
        totalPoints={userState.totalPoints}
        history={userState.history}
        isOpen={ledgerOpen}
        onClose={() => setLedgerOpen(false)}
      />
    </div>
  );
}
