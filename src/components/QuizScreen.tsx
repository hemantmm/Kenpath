'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Info,
  Award,
} from 'lucide-react';
import { Question } from '../types';
import { sounds } from '../lib/sound';

interface QuizScreenProps {
  questions: Question[];
  soundEnabled: boolean;
  isPracticeMode?: boolean;
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  soundEnabled,
  isPracticeMode = false,
  onComplete,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      sounds.playCorrect(soundEnabled);
    } else {
      sounds.playIncorrect(soundEnabled);
    }
  };

  const handleNext = () => {
    sounds.playClick(soundEnabled);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onComplete(score);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="sticky top-0 z-20 border-b border-slate-100 bg-white px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onExit}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            aria-label="Exit Challenge"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="text-center">
            <span className="text-xs font-bold text-slate-700">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            {isPracticeMode && (
              <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                Practice Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            <span>+{score * 10}</span>
            <span className="text-[10px] text-amber-600">pts</span>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex-1 p-4 pb-28">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{currentQuestion.category}</span>
        </div>

        <h2 className="text-lg font-bold text-slate-900 leading-snug tracking-tight mb-5">
          {currentQuestion.prompt}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((optionText, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQuestion.correctIndex;

            let buttonStyle =
              'border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-slate-50/80';
            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm';
                badgeStyle = 'bg-emerald-500 text-white border-emerald-500';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                badgeStyle = 'bg-rose-500 text-white border-rose-500';
              } else {
                buttonStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
                badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            }

            return (
              <button
                key={index}
                disabled={isAnswered}
                onClick={() => handleSelectOption(index)}
                className={`relative flex min-h-[58px] w-full items-center gap-3.5 rounded-2xl border-2 p-3.5 text-left text-sm font-semibold transition-all tap-bounce ${buttonStyle}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-all ${badgeStyle}`}
                >
                  {isAnswered && isCorrect ? (
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  ) : isAnswered && isSelected && !isCorrect ? (
                    <XCircle className="h-4.5 w-4.5" />
                  ) : (
                    optionLetters[index]
                  )}
                </div>

                <span className="flex-1 leading-snug">{optionText}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-5 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm animate-slide-up">
            <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900 mb-1">
              <Info className="h-4 w-4 text-indigo-600" />
              <span>
                {selectedOption === currentQuestion.correctIndex
                  ? 'Great Job! That’s Correct.'
                  : 'Important Note:'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-md">
          <button
            disabled={!isAnswered}
            onClick={handleNext}
            className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl text-base font-bold shadow-md transition-all active:scale-98 ${
              isAnswered
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>
              {currentIndex < totalQuestions - 1
                ? 'Next Question'
                : 'See My Results & Claim Points'}
            </span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
