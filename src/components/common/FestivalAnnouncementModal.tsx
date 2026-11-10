import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Tag, Check, ArrowRight, ExternalLink } from 'lucide-react';

export const FestivalAnnouncementModal: React.FC = () => {
  const { 
    activePopupAnnouncement, 
    dismissPopupAnnouncement, 
    openCategoryView 
  } = useApp();

  const [copied, setCopied] = useState(false);

  if (!activePopupAnnouncement) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCtaClick = () => {
    if (activePopupAnnouncement.ctaLink) {
      openCategoryView(activePopupAnnouncement.ctaLink);
    }
    dismissPopupAnnouncement();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-gradient-to-b from-[#161622] to-[#0d0d14] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden relative animate-scaleUp text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={dismissPopupAnnouncement}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner Image */}
        {activePopupAnnouncement.bannerUrl && (
          <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black">
            <img
              src={activePopupAnnouncement.bannerUrl}
              alt={activePopupAnnouncement.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161622] via-transparent to-black/40" />

            {/* Festive Badge */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-black text-xs font-black shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SPECIAL ANNOUNCEMENT</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-1.5">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
              {activePopupAnnouncement.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {activePopupAnnouncement.message}
            </p>
          </div>

          {/* Coupon Code Strip */}
          <div className="p-3.5 rounded-2xl bg-[#0e0e16] border border-amber-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-medium">Use Scholarship Code:</span>
                <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">
                  ALIFER50
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCopyCode('ALIFER50')}
              className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition-colors flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <span>Copy Code</span>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={handleCtaClick}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{activePopupAnnouncement.ctaText || 'Claim Early Admission'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={dismissPopupAnnouncement}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors text-center"
            >
              Remind Me Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
