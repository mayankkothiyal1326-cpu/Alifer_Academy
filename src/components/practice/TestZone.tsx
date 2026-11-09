import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PracticeTest, TestAttemptResult } from '../../types';
import { 
  FileCheck, 
  Clock, 
  Award, 
  ChevronRight, 
  Target, 
  Sparkles, 
  BookOpen, 
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { TestEngineModal } from './TestEngineModal';
import { TestResultModal } from './TestResultModal';

export const TestZone: React.FC = () => {
  const { practiceTests, activeTest, startTest, closeTest, testResult, setTestResult } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTestToTake, setActiveTestToTake] = useState<PracticeTest | null>(null);

  const categories = [
    { id: 'all', label: 'All Tests' },
    { id: 'Chapter-wise', label: 'Chapter-wise Tests' },
    { id: 'Unit', label: 'Unit Tests' },
    { id: 'Full Length Mock', label: 'Full Length Mocks' },
    { id: 'PYQ', label: 'Previous Year Questions (PYQ)' },
  ];

  const filteredTests = selectedCategory === 'all'
    ? practiceTests
    : practiceTests.filter(t => t.category === selectedCategory);

  const handleStartTest = (test: PracticeTest) => {
    setActiveTestToTake(test);
  };

  const handleTestComplete = (result: TestAttemptResult) => {
    setTestResult(result);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Practice Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#111118] via-[#161d19] to-[#0c0c12] border border-emerald-500/25 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
            <Target className="w-3.5 h-3.5" />
            <span>Alifer Academy Test & Assessment Hub</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-white">
            Practice Tests, Unit Quizzes & Exam Mock Papers
          </h2>
          <p className="text-xs text-zinc-300 max-w-lg">
            Timed simulation tests with negative marking, instant scorecards, and step-by-step mathematical explanations.
          </p>
        </div>

        <div className="p-3.5 bg-black/50 border border-emerald-500/30 rounded-2xl flex items-center gap-4 text-center shrink-0">
          <div>
            <span className="font-mono text-xl font-black text-amber-400 block">36/40</span>
            <span className="text-[10px] text-zinc-400">Recent Score</span>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div>
            <span className="font-mono text-xl font-black text-emerald-400 block">90%</span>
            <span className="text-[10px] text-zinc-400">Avg. Accuracy</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-[#101016] border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/10"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[10px] font-semibold">
                  {test.category}
                </span>
                <span className="text-zinc-400 font-medium text-[11px]">{test.subject}</span>
              </div>

              <h3 className="font-display text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                {test.title}
              </h3>

              {/* Meta indicators */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-400 block">Questions</span>
                  <span className="text-xs font-mono font-bold text-zinc-100 tabular-nums">
                    {test.questions.length || test.questionsCount} MCQs
                  </span>
                </div>
                <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-400 block">Duration</span>
                  <span className="text-xs font-mono font-bold text-amber-300 tabular-nums">
                    {test.durationMinutes} mins
                  </span>
                </div>
                <div className="p-2 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-400 block">Marks</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                    {test.totalMarks} Pts
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-medium">
                {test.negativeMarking ? '+4 / -1 Marking' : 'Standard Marking'}
              </span>

              <button
                onClick={() => handleStartTest(test)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold border border-emerald-500/30 hover:border-transparent transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Start Test</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Test Engine Modal */}
      {activeTestToTake && (
        <TestEngineModal
          test={activeTestToTake}
          onClose={() => setActiveTestToTake(null)}
          onComplete={(result) => {
            setActiveTestToTake(null);
            handleTestComplete(result);
          }}
        />
      )}

      {/* Test Scorecard / Result Modal */}
      {testResult && (
        <TestResultModal
          result={testResult}
          test={practiceTests.find(t => t.id === testResult.testId) || practiceTests[0]}
          onClose={() => setTestResult(null)}
          onRetake={() => {
            const foundTest = practiceTests.find(t => t.id === testResult.testId);
            setTestResult(null);
            if (foundTest) setActiveTestToTake(foundTest);
          }}
        />
      )}
    </div>
  );
};
