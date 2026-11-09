import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Clock } from 'lucide-react';

export const WatchHistoryStrip: React.FC = () => {
  const { watchHistory, courses, openLecture } = useApp();

  if (watchHistory.length === 0) return null;

  const latest = watchHistory[0];
  const matchedCourse = courses.find((c) => c.id === latest.courseId);
  let matchedLecture: any = null;
  matchedCourse?.modules.forEach((m) =>
    m.chapters.forEach((ch) =>
      ch.lectures.forEach((l) => {
        if (l.id === latest.lectureId) matchedLecture = l;
      })
    )
  );

  return (
    <div className="bg-[#111116] border border-amber-500/20 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
          {matchedLecture?.thumbnailUrl ? (
            <img
              src={matchedLecture.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <Play className="w-5 h-5 text-amber-400" />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
            <span className="text-amber-400 font-semibold uppercase tracking-wider">
              Continue Watching
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" />
              <span>{latest.watchedAt}</span>
            </span>
          </div>

          <h4 className="text-xs font-semibold text-white truncate mt-0.5">
            {latest.title}
          </h4>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-1.5 max-w-xs">
            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                style={{ width: `${latest.progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 tabular-nums">
              {latest.progressPercent}%
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (matchedCourse && matchedLecture) {
            openLecture(matchedLecture, matchedCourse);
          }
        }}
        className="self-stretch sm:self-auto px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
      >
        <Play className="w-3.5 h-3.5 fill-amber-300" />
        <span>Resume</span>
      </button>
    </div>
  );
};
