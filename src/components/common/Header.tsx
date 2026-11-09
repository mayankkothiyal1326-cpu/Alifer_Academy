import React from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { Bell, Sparkles, Shield, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    student, 
    unreadNotificationCount, 
    setIsNotificationOpen, 
    setIsAiOpen, 
    setActiveTab,
    setIsAdminOpen 
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#09090d]/95 backdrop-blur-md border-b border-amber-500/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Academy Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
            <img 
              src={BRAND_ASSETS.logo} 
              alt="Alifer Academy Logo" 
              className="w-full h-full object-cover rounded-full bg-black"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 leading-tight">
              ALIFER ACADEMY
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 font-medium uppercase">
              Learning For All
            </span>
          </div>
        </div>

        {/* Right Action Icons: AI Quick Launch, Notifications, Profile, Admin Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Switcher (Discreet & clean) */}
          <button
            onClick={() => setIsAdminOpen(true)}
            title="Academy Admin Portal"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-slate-300 hover:text-amber-300 border border-zinc-800 text-xs font-medium transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>

          {/* Alifer AI Assistant Button */}
          <button
            onClick={() => setIsAiOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/20 via-cyan-500/20 to-amber-500/20 hover:from-cyan-600/30 hover:to-amber-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Ask Alifer AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden xs:inline">Alifer AI</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative w-9 h-9 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/80 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-colors"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black font-extrabold text-[10px] flex items-center justify-center shadow-sm">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Student Profile Icon */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors"
            title="Student Profile"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-gradient-to-br from-amber-500/20 to-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-300 font-extrabold text-[11px] font-mono tracking-tighter">
              {student.avatarUrl && !student.avatarUrl.includes('WA0003') && !student.avatarUrl.includes('teacher') ? (
                <img 
                  src={student.avatarUrl} 
                  alt={student.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST'}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-xs font-medium text-slate-200 max-w-[90px] truncate">
              {student.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
