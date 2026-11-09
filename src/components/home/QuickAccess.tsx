import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, FileCheck, Download, Bookmark } from 'lucide-react';

interface QuickAccessProps {
  onOpenBookmarks?: () => void;
  onOpenDownloads?: () => void;
}

export const QuickAccess: React.FC<QuickAccessProps> = ({ onOpenBookmarks, onOpenDownloads }) => {
  const { setActiveTab, enrolledCourses, practiceTests, downloads, bookmarks } = useApp();

  const items = [
    {
      id: 'courses',
      label: 'My Courses',
      count: `${enrolledCourses.length} Active`,
      icon: BookOpen,
      color: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
      action: () => setActiveTab('learning'),
    },
    {
      id: 'tests',
      label: 'My Tests',
      count: `${practiceTests.length} Ready`,
      icon: FileCheck,
      color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
      action: () => setActiveTab('practice'),
    },
    {
      id: 'downloads',
      label: 'Downloads',
      count: `${downloads.length} Files`,
      icon: Download,
      color: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30',
      action: () => {
        if (onOpenDownloads) onOpenDownloads();
        else setActiveTab('learning');
      },
    },
    {
      id: 'bookmarks',
      label: 'Bookmarks',
      count: `${bookmarks.length} Saved`,
      icon: Bookmark,
      color: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30',
      action: () => {
        if (onOpenBookmarks) onOpenBookmarks();
        else setActiveTab('learning');
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={item.action}
            className={`p-3.5 rounded-xl bg-gradient-to-br ${item.color} border bg-[#111116] hover:bg-[#16161e] transition-all text-left flex items-center justify-between group active:scale-[0.98] shadow-sm`}
          >
            <div>
              <span className="text-xs font-bold text-white block group-hover:text-amber-300 transition-colors">
                {item.label}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">
                {item.count}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
