import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningInterest, SkillLevel, LearningGoal } from '../../types';
import { BRAND_ASSETS } from '../../data/constants';
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { student, updateStudent } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedInterests, setSelectedInterests] = useState<LearningInterest[]>(
    student.learningInterests || ['Mathematics', 'Programming']
  );
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>(
    student.skillLevel || 'Intermediate'
  );
  const [selectedGoals, setSelectedGoals] = useState<LearningGoal[]>(
    student.learningGoals || ['Exam Preparation']
  );

  if (!isOpen) return null;

  const interestsOptions: LearningInterest[] = [
    'Programming',
    'Mathematics',
    'Science',
    'Electronics',
    'Management',
    'Other',
  ];

  const levelsOptions: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  const goalsOptions: LearningGoal[] = [
    'Exam Preparation',
    'Skill Development',
    'Improve Knowledge',
    'Career Development',
  ];

  const toggleInterest = (val: LearningInterest) => {
    setSelectedInterests(prev =>
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const toggleGoal = (val: LearningGoal) => {
    setSelectedGoals(prev =>
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleFinish = () => {
    updateStudent({
      learningInterests: selectedInterests.length > 0 ? selectedInterests : ['Mathematics'],
      skillLevel: selectedLevel,
      learningGoals: selectedGoals.length > 0 ? selectedGoals : ['Skill Development'],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0e0e15] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-[#09090d]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Customize Your Learning Experience (Step {step} of 3)
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="h-1 bg-zinc-900 w-full">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* STEP 1: LEARNING INTERESTS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  What do you want to learn?
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select the subjects you are interested in (select multiple).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {interestsOptions.map((interest) => {
                  const isChecked = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <span>{interest}</span>
                      {isChecked && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SKILL LEVEL */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  What is your current skill level?
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  This helps tailor problem sets and practice test recommendations.
                </p>
              </div>

              <div className="space-y-2.5">
                {levelsOptions.map((lvl) => {
                  const isSelected = selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <span className="block text-sm">{lvl}</span>
                        <span className="text-[11px] text-zinc-400 font-normal">
                          {lvl === 'Beginner' && 'Starting from foundational principles and core concepts'}
                          {lvl === 'Intermediate' && 'Good understanding, seeking deeper problem-solving mastery'}
                          {lvl === 'Advanced' && 'Competitive and engineering examination level rigorous prep'}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: LEARNING GOALS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  What are your primary learning goals?
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select what you aim to achieve with Alifer Academy.
                </p>
              </div>

              <div className="space-y-2.5">
                {goalsOptions.map((goal) => {
                  const isChecked = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <span>{goal}</span>
                      {isChecked && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-[#09090d] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              Save Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
