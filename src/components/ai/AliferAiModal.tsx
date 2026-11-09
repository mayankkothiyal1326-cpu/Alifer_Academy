import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { AiChatMessage } from '../../types';
import { 
  X, 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Check, 
  HelpCircle, 
  BookOpen, 
  Code, 
  Calculator, 
  Globe2,
  RefreshCw
} from 'lucide-react';

export const AliferAiModal: React.FC = () => {
  const { isAiOpen, setIsAiOpen } = useApp();
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Namaste! I am the **ALIFER AI ASSISTANT**, your 24/7 academic doubt-solving mentor at Alifer Academy.

How can I help you excel today?
- **Mathematics & Calculus**: Step-by-step problem derivations
- **Science & Physics**: Concept visualisations & formula explanations
- **Coding & DSA**: Algorithm walkthroughs in Python, C++, Java
- **Multilingual**: Feel free to ask in English, Hindi, or Hinglish!
- **Doubt Upload**: Attach any homework or textbook image directly below.`,
      timestamp: 'Just now',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isAiOpen) return null;

  const suggestedPrompts = [
    { label: 'Limits & L\'Hopital', text: 'Explain when and how to apply L\'Hopital\'s rule step-by-step with an example in Hinglish.' },
    { label: 'Integration by Parts', text: 'Show the derivation of ∫ u dv = uv - ∫ v du (Integration by Parts) with ILATE rule.' },
    { label: 'Python DSA Complexity', text: 'Explain the difference between Time Complexity O(N log N) vs O(N^2) with a clean Python snippet.' },
    { label: 'Gauss Law in Physics', text: 'What is Gauss Law in Electrostatics and how do we calculate electric field of an infinite wire?' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text && !attachedImage) return;

    const userMessage: AiChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: text || 'Please analyze and explain the question in this attached image.',
      imageUrl: attachedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    const currentImage = attachedImage;
    setAttachedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          image: currentImage,
          subject: selectedSubject,
          history: messages.map(m => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || data.error || 'I could not generate a response right now. Please try again.';

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: `⚠️ Network error: Could not reach the Alifer AI service. Please ensure your connection is active and try again.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'new-welcome',
        role: 'assistant',
        text: 'New session started! What subject or problem would you like to solve today?',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="h-14 bg-[#0a0a0f] border-b border-amber-500/20 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-amber-400 to-yellow-300 p-0.5 shadow-md shadow-amber-950/40">
            <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                ALIFER AI ASSISTANT
              </h2>
              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Gemini Powered
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Personalized academic tutor · English, Hindi & Hinglish
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
            title="New Chat / Clear History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAiOpen(false)}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="px-4 py-2 bg-[#0d0d14] border-b border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-[11px] text-zinc-500 font-medium shrink-0">Subject focus:</span>
        {['Mathematics', 'Science', 'Programming', 'Electronics', 'General'].map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
              selectedSubject === sub
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 px-1">
                <span>{isUser ? 'You' : 'Alifer AI'}</span>
                <span aria-hidden="true">·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl max-w-[90%] sm:max-w-[85%] text-xs sm:text-sm leading-relaxed transition-all shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium rounded-tr-sm'
                    : 'bg-[#121219] border border-amber-500/20 text-zinc-100 rounded-tl-sm'
                }`}
              >
                {/* Image if attached */}
                {msg.imageUrl && (
                  <div className="mb-2.5 rounded-xl overflow-hidden border border-black/20">
                    <img src={msg.imageUrl} alt="Attached question" className="max-h-48 w-auto object-contain bg-black" />
                  </div>
                )}

                <div className="whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Alifer Academic Engine</span>
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="p-1 hover:text-amber-300 flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs text-zinc-400 w-fit">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Alifer AI is synthesizing step-by-step solution...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips when chat is light */}
      {messages.length <= 2 && (
        <div className="max-w-3xl w-full mx-auto px-4 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {suggestedPrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s.text)}
                className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-300 text-[11px] font-medium whitespace-nowrap transition-colors shrink-0"
              >
                💡 {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Message Input Box */}
      <div className="bg-[#0a0a0f] border-t border-zinc-800 p-3 sm:p-4 shrink-0">
        <div className="max-w-3xl w-full mx-auto space-y-2">
          {attachedImage && (
            <div className="relative inline-block border border-amber-500/40 rounded-xl overflow-hidden">
              <img src={attachedImage} alt="Preview" className="h-16 w-auto object-cover" />
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="absolute top-1 right-1 p-0.5 bg-black/80 rounded-full text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-[#121219] border border-amber-500/30 rounded-2xl p-2 pl-3 shadow-inner"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-zinc-400 hover:text-amber-400 transition-colors"
              title="Upload question photo or problem sheet"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question, formula doubt, or paste code..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={isLoading || (!inputMessage.trim() && !attachedImage)}
              className="w-9 h-9 rounded-xl bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-30 flex items-center justify-center transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4 fill-black" />
            </button>
          </form>
          <div className="text-[10px] text-zinc-500 text-center">
            Alifer AI adheres to verified academic syllabus · Verified against official course material.
          </div>
        </div>
      </div>
    </div>
  );
};
