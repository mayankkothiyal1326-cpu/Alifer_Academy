import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Settings, Wifi, Bell, Shield, Smartphone, Video, Check } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { student, updateStudent } = useApp();

  const [resolution, setResolution] = useState('1080p (Full HD)');
  const [wifiOnly, setWifiOnly] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0e0e15] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-[#09090d]">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              Application & Playback Settings
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Default Video Resolution */}
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">Default Video Quality</span>
              </div>
              <span className="text-amber-400 font-mono text-[11px]">{resolution}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {['Auto', '1080p (Full HD)', '720p (HD)', '480p'].map((r) => (
                <button
                  key={r}
                  onClick={() => setResolution(r)}
                  className={`py-1.5 rounded-lg text-center font-mono text-[10px] transition-colors ${
                    resolution === r
                      ? 'bg-amber-400 text-black font-bold'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {r.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Wi-Fi Only Downloads */}
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-semibold text-white block">Download Notes via Wi-Fi Only</span>
                <span className="text-[10px] text-zinc-400">Conserves cellular mobile data</span>
              </div>
            </div>
            <button
              onClick={() => setWifiOnly(!wifiOnly)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                wifiOnly ? 'bg-amber-400' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  wifiOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Push Notifications */}
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-semibold text-white block">Push Notifications</span>
                <span className="text-[10px] text-zinc-400">Class reminders & new test alerts</span>
              </div>
            </div>
            <button
              onClick={() => setPushNotifs(!pushNotifs)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                pushNotifs ? 'bg-amber-400' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  pushNotifs ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* SMS Alerts */}
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-semibold text-white block">SMS Class Reminders</span>
                <span className="text-[10px] text-zinc-400">Receive SMS 15 mins before live lectures</span>
              </div>
            </div>
            <button
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                smsAlerts ? 'bg-amber-400' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  smsAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-[#09090d] flex items-center justify-between">
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xs">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            {isSaved ? <Check className="w-4 h-4" /> : null}
            <span>{isSaved ? 'Preferences Saved' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
