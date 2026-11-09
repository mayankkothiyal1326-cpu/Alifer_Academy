import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import { Home, BookOpen, Radio, FileCheck, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learning', label: 'My Learning', icon: BookOpen },
    { id: 'live', label: 'Live Classes', icon: Radio },
    { id: 'practice', label: 'Practice', icon: FileCheck },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav 
      aria-label="Primary Navigation" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090d]/95 backdrop-blur-md border-t border-amber-500/15 pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="max-w-md md:max-w-xl mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-all relative select-none ${
                isActive 
                  ? 'text-amber-400 font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200 font-medium'
              }`}
            >
              {/* Active subtle gold bar on top of the icon */}
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-sm shadow-amber-400/50" />
              )}
              
              <div className="relative flex items-center justify-center mt-1">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.25px]' : 'stroke-[1.75px]'}`} />
                {tab.id === 'live' && (
                  <span className="absolute -top-1 -right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </div>
              
              <span className={`text-[10px] sm:text-[11px] tracking-tight mt-1 whitespace-nowrap ${isActive ? 'text-amber-300' : 'text-zinc-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
