import React, { useEffect } from 'react';
import { TestAttemptResult, PracticeTest } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Award, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Clock, 
  RotateCcw, 
  Share2, 
  Check,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TestResultModalProps {
  result: TestAttemptResult | null;
  test: PracticeTest | null;
  onClose: () => void;
  onRetake: () => void;
}

export const TestResultModal: React.FC<TestResultModalProps> = ({
  result,
  test,
  onClose,
  onRetake,
}) => {
  const { openPdfViewer } = useApp();

  useEffect(() => {
    if (result && result.score > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#10b981', '#38bdf8'],
        });
      } catch {
        // ignore
      }
    }
  }, [result]);

  if (!result || !test) return null;

  const scorePercentage = Math.max(0, Math.round((result.score / result.maxScore) * 100));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      {/* Top Header */}
      <div className="h-14 bg-[#0a0a0f] border-b border-zinc-800 px-4 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-xs sm:text-sm font-bold text-white">
            Performance Scorecard & Solutions
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {/* Scorecard Hero Banner */}
        <div className="bg-gradient-to-br from-[#13121a] via-[#1a1724] to-[#0f0e15] border-2 border-amber-500/30 rounded-2xl p-6 text-center space-y-4 shadow-2xl shadow-amber-950/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
            <span>Alifer Academy Evaluated Result</span>
          </div>

          <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
            {result.testTitle}
          </h1>

          {/* Big Score Dial */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="text-4xl sm:text-5xl font-mono font-black text-amber-400 tracking-tight">
              {result.score} <span className="text-xl sm:text-2xl text-zinc-500 font-normal">/ {result.maxScore}</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Final Marks ({scorePercentage}% Accuracy Performance)
            </p>
          </div>

          {/* 4 Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800">
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Correct</span>
              <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                {result.correctAnswersCount}
              </span>
            </div>
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Incorrect</span>
              <span className="text-lg font-mono font-bold text-rose-400 tabular-nums">
                {result.incorrectAnswersCount}
              </span>
            </div>
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Skipped</span>
              <span className="text-lg font-mono font-bold text-zinc-400 tabular-nums">
                {result.unattemptedCount}
              </span>
            </div>
            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Time Spent</span>
              <span className="text-lg font-mono font-bold text-cyan-400 tabular-nums">
                {Math.round(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onRetake}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Test</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs border border-zinc-800"
            >
              Back to Practice Zone
            </button>
          </div>
        </div>

        {/* DETAILED QUESTION-BY-QUESTION SOLUTIONS & EXPLANATIONS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
              Step-by-Step Questions Breakdown & Explanations
            </h3>
            <span className="text-xs text-zinc-400">
              {test.questions.length} Questions Reviewed
            </span>
          </div>

          <div className="space-y-4">
            {test.questions.map((q, idx) => {
              const selectedOptId = result.userAnswers[q.id];
              const isCorrect = selectedOptId === q.correctOptionId;
              const isSkipped = !selectedOptId;

              return (
                <div
                  key={q.id}
                  className={`bg-[#101016] border rounded-2xl p-4 sm:p-5 space-y-3 ${
                    isCorrect
                      ? 'border-emerald-500/30'
                      : isSkipped
                      ? 'border-zinc-800'
                      : 'border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-400">
                      Question {idx + 1} of {test.questions.length} · {q.topic}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isSkipped
                          ? 'bg-zinc-800 text-zinc-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {isCorrect ? '+4 Correct' : isSkipped ? '0 Skipped' : '-1 Incorrect'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt) => {
                      const isOptionCorrect = opt.id === q.correctOptionId;
                      const isOptionSelected = opt.id === selectedOptId;

                      let optStyle = 'bg-zinc-950/60 border-zinc-800 text-zinc-300';
                      if (isOptionCorrect) {
                        optStyle = 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200 font-semibold';
                      } else if (isOptionSelected && !isCorrect) {
                        optStyle = 'bg-rose-950/30 border-rose-500/60 text-rose-200';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}
                        >
                          <span>{opt.text}</span>
                          {isOptionCorrect && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                          )}
                          {isOptionSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step-by-Step Mathematical Explanation */}
                  <div className="mt-3 p-3.5 bg-amber-950/20 rounded-xl border-l-2 border-amber-400 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                      Er. Alifer Sir's Step-by-Step Explanation
                    </span>
                    <p className="text-xs text-zinc-200 whitespace-pre-line leading-relaxed font-mono">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
