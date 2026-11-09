import React, { useState, useEffect } from 'react';
import { PracticeTest, TestAttemptResult } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface TestEngineModalProps {
  test: PracticeTest | null;
  onClose: () => void;
  onComplete: (result: TestAttemptResult) => void;
}

export const TestEngineModal: React.FC<TestEngineModalProps> = ({
  test,
  onClose,
  onComplete,
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Initialize timer on start
  useEffect(() => {
    if (test) {
      setTimeLeftSeconds(test.durationMinutes * 60);
    }
  }, [test]);

  // Countdown effect
  useEffect(() => {
    if (!hasStarted || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted, timeLeftSeconds]);

  if (!test) return null;

  const currentQuestion = test.questions[currentQuestionIndex];

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const toggleMarkForReview = () => {
    if (!currentQuestion) return;
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleFinishTest = () => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    test.questions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (!userAns) {
        unattempted++;
      } else if (userAns === q.correctOptionId) {
        correct++;
        score += q.marks;
      } else {
        incorrect++;
        if (test.negativeMarking) {
          score -= q.negativeMarks;
        }
      }
    });

    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    const totalTimeSpent = test.durationMinutes * 60 - timeLeftSeconds;

    const result: TestAttemptResult = {
      id: `attempt-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      date: new Date().toLocaleDateString('en-GB'),
      score: Math.max(0, score),
      maxScore: test.totalMarks,
      totalQuestions: test.questions.length,
      correctAnswersCount: correct,
      incorrectAnswersCount: incorrect,
      unattemptedCount: unattempted,
      accuracyPercent: accuracy,
      timeSpentSeconds: totalTimeSpent,
      userAnswers: selectedAnswers,
    };

    onComplete(result);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. BEFORE TEST: Instructions screen
  if (!hasStarted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-2xl bg-[#0f0e15] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-[#09090d]">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                Test Instructions & Rules
              </h2>
            </div>
            <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            <div>
              <span className="text-xs font-semibold text-amber-400">{test.subject} · {test.category}</span>
              <h1 className="font-display text-lg sm:text-xl font-bold text-white mt-1">
                {test.title}
              </h1>
            </div>

            {/* Test Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Questions</span>
                <span className="text-base font-mono font-bold text-white tabular-nums">
                  {test.questions.length || test.questionsCount}
                </span>
              </div>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Marks</span>
                <span className="text-base font-mono font-bold text-amber-400 tabular-nums">
                  {test.totalMarks}
                </span>
              </div>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Duration</span>
                <span className="text-base font-mono font-bold text-cyan-400 tabular-nums">
                  {test.durationMinutes} Mins
                </span>
              </div>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Marking</span>
                <span className="text-base font-mono font-bold text-emerald-400">
                  +4 / -1 Mark
                </span>
              </div>
            </div>

            {/* Marking Rules and Instructions */}
            <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                General Instructions:
              </h3>
              <ul className="space-y-2 text-xs text-zinc-300">
                {test.instructions.map((inst, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{inst}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Do not close or reload the browser while attempting the test.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-zinc-800 bg-[#09090d] flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => setHasStarted(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              I Understand · Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. LIVE TEST ENGINE SCREEN
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white animate-in fade-in duration-150">
      {/* Top Test Header with Timer */}
      <div className="h-14 bg-[#0a0a0f] border-b border-zinc-800 px-4 flex items-center justify-between shrink-0">
        <div className="min-w-0">
          <h2 className="text-xs sm:text-sm font-bold text-white truncate">
            {test.title}
          </h2>
          <span className="text-[10px] text-zinc-400">
            Question {currentQuestionIndex + 1} of {test.questions.length}
          </span>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold shadow-sm">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs transition-colors"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Split: Question Area on Left, Question Palette on Right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Active Question Canvas */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
              <span className="text-amber-400 font-semibold">{currentQuestion?.topic}</span>
              <span className="font-mono text-[11px] text-emerald-400">+4 / -1 Mark</span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              {currentQuestion?.questionText}
            </p>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5 pt-2">
              {currentQuestion?.options.map((opt) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold shadow-md'
                        : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span>{opt.text}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-amber-400 bg-amber-400 text-black' : 'border-zinc-600'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row at Bottom */}
          <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMarkForReview}
                className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  markedForReview[currentQuestion?.id]
                    ? 'bg-purple-900/30 text-purple-300 border-purple-500'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{markedForReview[currentQuestion?.id] ? 'Marked' : 'Mark for Review'}</span>
              </button>

              <button
                onClick={handleClearResponse}
                disabled={!selectedAnswers[currentQuestion?.id]}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-400 hover:text-white border border-zinc-800 text-xs transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex <= 0}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white disabled:opacity-40 text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex >= test.questions.length - 1}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40 text-xs font-bold flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette & Navigation */}
        <div className="w-full lg:w-72 bg-[#0c0c12] border-t lg:border-t-0 lg:border-l border-zinc-800 p-4 flex flex-col justify-between shrink-0">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Question Palette
            </h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span>Unattempted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Current</span>
              </div>
            </div>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((q, idx) => {
                const isSelected = selectedAnswers[q.id];
                const isMarked = markedForReview[q.id];
                const isCurrent = idx === currentQuestionIndex;

                let btnBg = 'bg-zinc-900 text-zinc-400 border-zinc-800';
                if (isCurrent) {
                  btnBg = 'bg-amber-400 text-black font-extrabold border-amber-300';
                } else if (isMarked) {
                  btnBg = 'bg-purple-900/60 text-purple-300 border-purple-500';
                } else if (isSelected) {
                  btnBg = 'bg-emerald-600 text-white font-bold border-emerald-500';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg border text-xs font-mono flex items-center justify-center transition-all ${btnBg}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 mt-4">
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors shadow-lg shadow-emerald-950/40"
            >
              Submit & View Solutions
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121218] border border-zinc-800 rounded-2xl p-5 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="font-display text-base font-bold text-white">
              Are you ready to submit?
            </h3>
            <p className="text-xs text-zinc-300">
              You have answered {Object.keys(selectedAnswers).length} out of {test.questions.length} questions. You cannot change your responses once submitted.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleFinishTest();
                }}
                className="flex-1 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
