import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCheck, 
  Radio, 
  FileText, 
  Award, 
  Bell, 
  ArrowLeft, 
  ExternalLink, 
  Image as ImageIcon,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { NotificationItem } from '../../types';

export const NotificationModal: React.FC = () => {
  const { 
    isNotificationOpen, 
    setIsNotificationOpen, 
    notifications, 
    markNotificationsAsRead,
    markSingleNotificationAsRead,
    setActiveTab 
  } = useApp();

  const [selectedItem, setSelectedItem] = useState<NotificationItem | null>(null);

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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'live':
        return <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-bold">Live Stream</span>;
      case 'test':
        return <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">Exam / Test</span>;
      case 'lecture':
        return <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">Study Notes</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">Broadcast Alert</span>;
    }
  };

  const handleSelectNotification = (item: NotificationItem) => {
    setSelectedItem(item);
    if (!item.read) {
      markSingleNotificationAsRead(item.id);
    }
  };

  const handleActionClick = (type: string) => {
    if (type === 'live') {
      setActiveTab('live');
      setIsNotificationOpen(false);
      setSelectedItem(null);
    } else if (type === 'test') {
      setActiveTab('practice');
      setIsNotificationOpen(false);
      setSelectedItem(null);
    } else if (type === 'lecture') {
      setActiveTab('learning');
      setIsNotificationOpen(false);
      setSelectedItem(null);
    } else {
      setIsNotificationOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#0e0e14] border border-amber-500/25 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-zinc-800 bg-[#12121c]">
          <div className="flex items-center gap-2.5">
            {selectedItem ? (
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Back to notifications list"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bell className="w-4 h-4" />
              </div>
            )}
            <div>
              <h3 id="notif-title" className="text-sm font-bold text-white tracking-wide">
                {selectedItem ? 'Announcement Details' : 'Notifications & Broadcasts'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-zinc-400">
                {selectedItem ? selectedItem.timestamp : 'Alifer Academy live updates & alerts'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!selectedItem && (
              <button
                onClick={markNotificationsAsRead}
                className="p-1.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg flex items-center gap-1 transition-colors"
                title="Mark all read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px] font-semibold">Mark read</span>
              </button>
            )}
            <button
              onClick={() => {
                setIsNotificationOpen(false);
                setSelectedItem(null);
              }}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body: List View OR Detailed Full View */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {selectedItem ? (
            /* ==================================================
               FULL NOTIFICATION DETAIL VIEW
               ================================================== */
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  {getTypeBadge(selectedItem.type)}
                  <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    <span>{selectedItem.timestamp}</span>
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Delivered</span>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide leading-snug">
                {selectedItem.title}
              </h2>

              {/* Attached Banner Image (High Resolution) */}
              {selectedItem.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-amber-500/30 bg-black shadow-lg">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full max-h-72 object-contain bg-black/90"
                  />
                  <div className="px-3 py-1.5 bg-zinc-950/80 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-amber-400" />
                      <span>Official Academy Banner Attachment</span>
                    </span>
                    <a
                      href={selectedItem.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Full Image</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Message Body */}
              <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-xl">
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {selectedItem.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                {selectedItem.type === 'live' && (
                  <button
                    onClick={() => handleActionClick('live')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Open Live Class Arena</span>
                  </button>
                )}
                {selectedItem.type === 'test' && (
                  <button
                    onClick={() => handleActionClick('test')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Award className="w-4 h-4" />
                    <span>Attempt Practice Test</span>
                  </button>
                )}
                {selectedItem.type === 'lecture' && (
                  <button
                    onClick={() => handleActionClick('lecture')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Study Materials</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors"
                >
                  Back to List
                </button>
              </div>
            </div>
          ) : (
            /* ==================================================
               NOTIFICATIONS LIST VIEW
               ================================================== */
            <div className="space-y-2.5">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs space-y-2">
                  <Bell className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p>No notifications at this time.</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectNotification(item)}
                    className={`p-3.5 rounded-xl transition-all cursor-pointer border hover:border-amber-500/40 hover:bg-zinc-900/70 flex gap-3 group ${
                      !item.read
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                        : 'bg-[#101016]/90 border-zinc-800/80 opacity-90'
                    }`}
                  >
                    {/* Icon or Thumbnail Preview */}
                    <div className="shrink-0 mt-0.5">
                      {item.imageUrl ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-500/30 bg-black shrink-0 relative">
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                          {getIcon(item.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                          {item.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          {getTypeBadge(item.type)}
                          {item.imageUrl && (
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              <ImageIcon className="w-2.5 h-2.5" />
                              <span>Banner attached</span>
                            </span>
                          )}
                        </div>
                        <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                          <span>View Details</span>
                          <span>→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-zinc-800/80 bg-zinc-950/60 flex justify-between items-center text-[11px] text-zinc-500">
          <span>Alifer Academy Notification Service</span>
          <button 
            onClick={() => {
              setIsNotificationOpen(false);
              setSelectedItem(null);
            }}
            className="text-amber-400 font-semibold hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
