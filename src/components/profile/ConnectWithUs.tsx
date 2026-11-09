import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../../data/constants';
import { 
  MessageSquare, 
  Send, 
  Youtube, 
  Instagram, 
  Facebook, 
  Globe, 
  Mail, 
  ExternalLink,
  Check
} from 'lucide-react';

export const ConnectWithUs: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-cyan-400" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-rose-400" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-400" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-400" />;
      case 'website':
        return <Globe className="w-5 h-5 text-amber-400" />;
      case 'email':
        return <Mail className="w-5 h-5 text-amber-300" />;
      default:
        return <Globe className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleLinkClick = (url: string, name: string) => {
    setCopiedLink(name);
    setTimeout(() => setCopiedLink(null), 2500);
    // If it's a valid link or mailto
    if (url.startsWith('mailto:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
          Connect With Alifer Academy
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Follow official channels for daily problem sets, live class alerts, and direct teacher guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SOCIAL_LINKS.map((link) => (
          <button
            key={link.name}
            onClick={() => handleLinkClick(link.url, link.name)}
            className="p-3.5 rounded-xl bg-[#101016] hover:bg-[#14141e] border border-zinc-800 hover:border-amber-500/30 text-left flex items-center justify-between gap-3 transition-all duration-200 group shadow-sm active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getPlatformIcon(link.platform)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  {link.name}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {link.description}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-zinc-500 group-hover:text-amber-400 transition-colors">
              {copiedLink === link.name ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Connecting...</span>
                </span>
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
