import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, Radio, FileText, Award, Bell } from 'lucide-react';

export const NotificationModal: React.FC = () => {
  const { 
    isNotificationOpen, 
    setIsNotificationOpen, 
    notifications, 
    markNotificationsAsRead, 
    setActiveTab 
  } = useApp();

  if (!isNotificationOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'live':
        return <Radio className="w-4 h-4 text-rose-400" />;
      case 'test':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'lecture':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#0e0e14] border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 id="notif-title" className="text-sm font-bold text-white tracking-wide">
                Notifications & Announcements
              </h3>
              <p className="text-[11px] text-zinc-400">Alifer Academy updates & live alerts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              className="p-1.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg flex items-center gap-1 transition-colors"
              title="Mark all read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Mark read</span>
            </button>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/80 p-2">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No new notifications at this time.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'live') {
                    setActiveTab('live');
                    setIsNotificationOpen(false);
                  } else if (item.type === 'test') {
                    setActiveTab('practice');
                    setIsNotificationOpen(false);
                  } else if (item.type === 'lecture') {
                    setActiveTab('learning');
                    setIsNotificationOpen(false);
                  }
                }}
                className={`p-3.5 rounded-xl transition-all cursor-pointer hover:bg-zinc-900/60 flex items-start gap-3 ${
                  !item.read ? 'bg-amber-950/15 border-l-2 border-amber-500' : 'opacity-85'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-semibold text-zinc-100 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-zinc-500 shrink-0 tabular-nums">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-950/40 flex justify-between items-center text-[11px] text-zinc-500">
          <span>Stay notified on classes & tests</span>
          <button 
            onClick={() => setIsNotificationOpen(false)}
            className="text-amber-400 font-medium hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
