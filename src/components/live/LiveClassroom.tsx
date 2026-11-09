import React, { useState } from 'react';
import { LiveClass, LiveChatMessage } from '../../types';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { 
  X, 
  Radio, 
  Send, 
  Users, 
  FileText, 
  HelpCircle, 
  Download, 
  Smile, 
  CheckCircle,
  Play
} from 'lucide-react';

interface LiveClassroomProps {
  liveClass: LiveClass | null;
  onClose: () => void;
}

export const LiveClassroom: React.FC<LiveClassroomProps> = ({ liveClass, onClose }) => {
  const { student, openPdfViewer, addDownload } = useApp();
  const [activeTab, setActiveTab] = useState<'chat' | 'doubts' | 'handouts'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [doubtInput, setDoubtInput] = useState('');
  const [messages, setMessages] = useState<LiveChatMessage[]>([
    {
      id: 'm1',
      sender: 'Er. Alifer Sir',
      avatar: BRAND_ASSETS.teacherPortrait,
      text: 'Welcome students! Today we are mastering the King Property of Definite Integration. Keep your notebooks open.',
      timestamp: '15 mins ago',
      isTeacher: true,
    },
    {
      id: 'm2',
      sender: 'Aman Verma',
      avatar: BRAND_ASSETS.logo,
      text: 'Good evening Sir! Ready with pen and paper.',
      timestamp: '12 mins ago',
    },
    {
      id: 'm3',
      sender: 'Priya Joshi',
      avatar: BRAND_ASSETS.logo,
      text: 'Sir please explain why ∫ f(a+b-x) dx = ∫ f(x) dx is valid with substitution.',
      timestamp: '5 mins ago',
    },
    {
      id: 'm4',
      sender: 'Er. Alifer Sir',
      avatar: BRAND_ASSETS.teacherPortrait,
      text: 'Substitute u = a + b - x, so du = -dx. When x=a, u=b. Limits invert and cancel the negative sign! See the board now.',
      timestamp: '2 mins ago',
      isTeacher: true,
    },
  ]);

  const [doubts, setDoubts] = useState<Array<{ id: string; student: string; text: string; status: 'answered' | 'queued' }>>([
    {
      id: 'd1',
      student: 'Rohit K.',
      text: 'Does this symmetry shortcut work for periodic functions with integer periods?',
      status: 'answered',
    },
    {
      id: 'd2',
      student: 'Kavita S.',
      text: 'Can we apply Leibnitz integral rule when limits are functions of two variables?',
      status: 'queued',
    },
  ]);

  if (!liveClass) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `msg-${Date.now()}`,
      sender: student.name,
      avatar: student.avatarUrl,
      text: chatInput.trim(),
      timestamp: 'Just now',
    };
    setMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  const handleSendDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtInput.trim()) return;

    setDoubts(prev => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        student: student.name,
        text: doubtInput.trim(),
        status: 'queued',
      },
    ]);
    setDoubtInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="h-14 bg-[#0a0a0f] border-b border-zinc-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            {liveClass.status === 'live' && (
              <span className="px-2 py-0.5 rounded bg-rose-500 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                <Radio className="w-3 h-3" />
                LIVE
              </span>
            )}
            <h2 className="text-xs sm:text-sm font-bold text-white truncate">
              {liveClass.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          {liveClass.viewerCount && (
            <span className="flex items-center gap-1.5 text-zinc-300 font-mono">
              <Users className="w-3.5 h-3.5 text-rose-400" />
              <span>{liveClass.viewerCount} Watching</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Split Layout: Video Screen on Left, Live Interactive Deck on Right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video Canvas */}
        <div className="flex-1 bg-black flex flex-col justify-center items-center relative overflow-hidden">
          <div className="relative w-full aspect-video max-h-[75vh]">
            <video
              src={liveClass.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            />
          </div>

          {/* Teacher Info Strip below live player */}
          <div className="w-full bg-[#0d0d13] border-t border-zinc-800 p-3 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-black">
                <img
                  src={liveClass.instructorAvatar || BRAND_ASSETS.teacherPortrait}
                  alt={liveClass.instructorName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white">
                  {liveClass.instructorName}
                </span>
                <p className="text-[10px] text-amber-300">
                  {liveClass.courseName} · {liveClass.subject}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {liveClass.handouts.length > 0 && (
                <button
                  onClick={() => openPdfViewer({
                    title: liveClass.handouts[0].title,
                    courseName: liveClass.courseName,
                    pages: liveClass.handouts[0].pages,
                  })}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Class Handout (PDF)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Interactive Deck (Chat, Doubts, Handouts) */}
        <div className="w-full lg:w-96 bg-[#0e0e14] border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col h-72 lg:h-auto">
          {/* Deck Tabs */}
          <div className="flex items-center border-b border-zinc-800 text-xs bg-zinc-950">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 font-semibold text-center transition-colors border-b-2 ${
                activeTab === 'chat'
                  ? 'border-amber-400 text-amber-300 bg-amber-950/10'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Live Chat
            </button>
            <button
              onClick={() => setActiveTab('doubts')}
              className={`flex-1 py-3 font-semibold text-center transition-colors border-b-2 ${
                activeTab === 'doubts'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/10'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Ask Doubt
            </button>
            <button
              onClick={() => setActiveTab('handouts')}
              className={`flex-1 py-3 font-semibold text-center transition-colors border-b-2 ${
                activeTab === 'handouts'
                  ? 'border-purple-400 text-purple-300 bg-purple-950/10'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              Handouts
            </button>
          </div>

          {/* Tab 1: Live Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-xl text-xs space-y-1 ${
                      m.isTeacher
                        ? 'bg-amber-950/25 border border-amber-500/30'
                        : 'bg-zinc-900/60 border border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-bold ${m.isTeacher ? 'text-amber-300' : 'text-zinc-200'}`}>
                        {m.sender} {m.isTeacher && '👑 Educator'}
                      </span>
                      <span className="text-zinc-500">{m.timestamp}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-2 border-t border-zinc-800 bg-zinc-950 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message to class..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-lg bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Ask Doubt */}
          {activeTab === 'doubts' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden p-3 space-y-3">
              <div className="flex-1 overflow-y-auto space-y-2.5">
                <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-zinc-300">
                  <p className="font-semibold text-cyan-300 mb-1">
                    Direct Live Doubt Queue
                  </p>
                  Your question will appear on the instructor dashboard for live answering.
                </div>

                {doubts.map((d) => (
                  <div key={d.id} className="p-2.5 bg-zinc-900/70 border border-zinc-800 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-white">{d.student}</span>
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${
                        d.status === 'answered' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {d.status === 'answered' ? 'Answered on stream' : 'Queued'}
                      </span>
                    </div>
                    <p className="text-zinc-300">{d.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendDoubt} className="flex gap-2">
                <input
                  type="text"
                  value={doubtInput}
                  onChange={(e) => setDoubtInput(e.target.value)}
                  placeholder="Ask specific live doubt..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!doubtInput.trim()}
                  className="px-3 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 disabled:opacity-40"
                >
                  Post
                </button>
              </form>
            </div>
          )}

          {/* Tab 3: Handouts */}
          {activeTab === 'handouts' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {liveClass.handouts.map((h) => (
                <div key={h.id} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <h5 className="text-xs font-semibold text-white">{h.title}</h5>
                  </div>
                  <p className="text-[10px] text-zinc-400">Size: {h.fileSize} · {h.pages} Pages</p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => openPdfViewer({
                        title: h.title,
                        courseName: liveClass.courseName,
                        pages: h.pages,
                      })}
                      className="flex-1 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-purple-300 font-medium text-center"
                    >
                      View Notes
                    </button>
                    <button
                      onClick={() => addDownload({
                        title: h.title,
                        courseName: liveClass.courseName,
                        type: 'pdf',
                        fileSize: h.fileSize,
                        totalPages: h.pages,
                        localPath: `/storage/${encodeURIComponent(h.title)}.pdf`,
                      })}
                      className="p-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
