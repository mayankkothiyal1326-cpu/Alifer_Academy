import React from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { PlayCircle, ArrowRight, Sparkles, Award } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setActiveTab, setIsAiOpen } = useApp();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111118] via-[#161622] to-[#0c0c12] border border-amber-500/25 p-4 sm:p-6 shadow-xl">
      {/* Subtle gold ambient glow */}
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left Information */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Alifer Academy · Excellence in EdTech</span>
          </div>

          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Master Every Concept With <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-400">
              Er. Alifer Sir
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
            Simplified engineering mathematics, physics & coding. High-yield video lectures, handwritten notes, and instant Alifer AI doubt clearance.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
            <button
              onClick={() => setActiveTab('live')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <PlayCircle className="w-4 h-4 fill-black" />
              <span>Join Live Classes</span>
            </button>
            <button
              onClick={() => setIsAiOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask Alifer AI</span>
            </button>
          </div>
        </div>

        {/* Right: Teacher Photography Lockup */}
        <div className="shrink-0 relative group">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl shadow-amber-950/50 bg-black">
            <img
              src={BRAND_ASSETS.teacherPortrait}
              alt="Er. Alifer Sir - Founder & Lead Educator"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Scrim overlay with badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-2.5 text-center">
              <span className="text-[11px] font-bold text-white tracking-wide">
                Er. Alifer Sir
              </span>
              <span className="text-[9px] text-amber-300 font-medium">
                Founder & Lead Mentor
              </span>
            </div>
          </div>
          {/* Circular academy seal overlay */}
          <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full border-2 border-amber-400 overflow-hidden shadow-lg bg-black">
            <img 
              src={BRAND_ASSETS.logo} 
              alt="Seal" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
