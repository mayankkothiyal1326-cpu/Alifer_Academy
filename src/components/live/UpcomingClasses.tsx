import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LiveClass } from '../../types';
import { BRAND_ASSETS } from '../../data/constants';
import { Radio, Calendar, Clock, Bell, Play, FileText, CheckCircle2 } from 'lucide-react';
import { LiveClassroom } from './LiveClassroom';

export const UpcomingClasses: React.FC = () => {
  const { liveClasses, openPdfViewer } = useApp();
  const [selectedLiveClass, setSelectedLiveClass] = useState<LiveClass | null>(null);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  const toggleReminder = (id: string) => {
    setReminders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const liveNow = liveClasses.filter(c => c.status === 'live');
  const upcoming = liveClasses.filter(c => c.status === 'upcoming');
  const completed = liveClasses.filter(c => c.status === 'completed');

  return (
    <div className="space-y-6 pb-20">
      {/* Tab Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#111118] via-[#1a1216] to-[#0c0c12] border border-rose-500/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[11px] font-bold text-rose-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Alifer Academy Live Studio</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-white">
            Interactive Live Classes & Doubt Sessions
          </h2>
          <p className="text-xs text-zinc-300 max-w-lg">
            Join Er. Alifer Sir in high-energy real-time sessions with live problem solving, handouts, and live questions.
          </p>
        </div>

        <div className="w-16 h-16 rounded-full border-2 border-rose-500/50 overflow-hidden shrink-0 bg-black shadow-lg shadow-rose-950/40">
          <img
            src={BRAND_ASSETS.teacherPortrait}
            alt="Er. Alifer Sir"
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* 1. ONGOING LIVE CLASSES */}
      {liveNow.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h3 className="font-display text-sm font-bold text-white tracking-wide">
              Ongoing Live Stream
            </h3>
          </div>

          <div className="space-y-3">
            {liveNow.map((live) => (
              <div
                key={live.id}
                className="bg-[#120e14] border-2 border-rose-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-rose-950/20"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-rose-500/40 shrink-0 bg-black">
                    <img
                      src={live.instructorAvatar || BRAND_ASSETS.teacherPortrait}
                      alt={live.instructorName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-rose-600 text-[9px] font-black text-white uppercase">
                      Live
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider block">
                      {live.courseName} · {live.subject}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                      {live.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Conducted by {live.instructorName} · {live.viewerCount} students currently watching
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLiveClass(live)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 active:scale-95 transition-all shrink-0"
                >
                  <Radio className="w-4 h-4" />
                  <span>Join Live Stream</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. UPCOMING LIVE SESSIONS */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-bold text-white tracking-wide">
          Upcoming Scheduled Classes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {upcoming.map((up) => {
            const hasReminder = reminders[up.id];

            return (
              <div
                key={up.id}
                className="bg-[#101016] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/30 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                    <span className="text-amber-400 font-semibold">{up.subject}</span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-300">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{up.scheduledTime}</span>
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">
                    {up.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    With {up.instructorName}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                  {up.handouts.length > 0 && (
                    <button
                      onClick={() => openPdfViewer({
                        title: up.handouts[0].title,
                        courseName: up.courseName,
                        pages: up.handouts[0].pages,
                      })}
                      className="text-xs text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Pre-Class PDF</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleReminder(up.id)}
                    className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      hasReminder
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    {hasReminder ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Reminder Set</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        <span>Notify Me</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. AVAILABLE RECORDINGS OF COMPLETED LIVE SESSIONS */}
      <div className="space-y-3">
        <h3 className="font-display text-sm font-bold text-white tracking-wide">
          Past Live Class Recordings
        </h3>

        <div className="space-y-3">
          {completed.map((comp) => (
            <div
              key={comp.id}
              className="bg-[#101016] border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                    {comp.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                    <span>{comp.courseName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{comp.scheduledTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {comp.handouts.length > 0 && (
                  <button
                    onClick={() => openPdfViewer({
                      title: comp.handouts[0].title,
                      courseName: comp.courseName,
                      pages: comp.handouts[0].pages,
                    })}
                    className="p-1.5 text-zinc-400 hover:text-amber-400 rounded-lg hover:bg-zinc-900"
                    title="View Class Notes"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedLiveClass(comp)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-amber-300 border border-zinc-800"
                >
                  Watch Recording
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Live Class or Recording Room Modal */}
      {selectedLiveClass && (
        <LiveClassroom
          liveClass={selectedLiveClass}
          onClose={() => setSelectedLiveClass(null)}
        />
      )}
    </div>
  );
};
