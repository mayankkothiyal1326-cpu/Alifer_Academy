import React from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { X, Award, Download, CheckCircle, ShieldCheck } from 'lucide-react';

interface CertificateModalProps {
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ onClose }) => {
  const { student, enrolledCourses } = useApp();
  const completedCourse = enrolledCourses[0] || {
    title: 'Complete Engineering & Higher Mathematics Mastery',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0e0e15] border-2 border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Bar */}
        <div className="h-12 bg-zinc-950 px-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              Official Alifer Academy Certificate
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Canvas */}
        <div className="p-6 sm:p-10 flex-1 overflow-y-auto flex justify-center bg-[#07070a]">
          <div className="w-full max-w-xl bg-gradient-to-b from-[#14131b] via-[#101016] to-[#0c0c11] border-4 border-amber-500/40 p-6 sm:p-8 rounded-2xl relative shadow-2xl flex flex-col justify-between text-center space-y-6">
            {/* Corner Decorative Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

            {/* Header */}
            <div className="space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-lg">
                <img src={BRAND_ASSETS.logo} alt="Seal" className="w-full h-full object-cover rounded-full bg-black" />
              </div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-400 uppercase">
                ALIFER ACADEMY
              </h2>
              <p className="text-[10px] tracking-widest uppercase text-zinc-400 font-semibold">
                Certificate of Academic Excellence
              </p>
            </div>

            {/* Recipient */}
            <div className="space-y-1">
              <span className="text-xs text-zinc-400 italic">This is proudly presented to</span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-wide border-b border-amber-500/30 pb-2 max-w-sm mx-auto">
                {student.name}
              </h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto pt-2 leading-relaxed">
                For successfully completing the comprehensive coursework, video lectures, and practice examinations in:
              </p>
              <h4 className="text-sm sm:text-base font-bold text-amber-300 pt-1">
                {completedCourse.title}
              </h4>
            </div>

            {/* Verification Signatures & Seal */}
            <div className="pt-6 border-t border-zinc-800/80 flex items-end justify-between text-left">
              <div className="space-y-1">
                <div className="font-mono text-[10px] text-zinc-500">Certificate ID:</div>
                <div className="font-mono text-xs font-bold text-zinc-300">ALF-CERT-2026-9941</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Digitally Verified</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="w-24 border-b border-zinc-600 mb-1" />
                <div className="text-xs font-bold text-white">Er. Alifer Sir</div>
                <div className="text-[10px] text-amber-400">Founder & Academic Director</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="h-14 bg-zinc-950 px-6 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Issued under Alifer Academy verification standards</span>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download & Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
