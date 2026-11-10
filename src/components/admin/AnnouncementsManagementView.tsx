import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Sparkles, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Tag,
  Users,
  Upload
} from 'lucide-react';

export const AnnouncementsManagementView: React.FC = () => {
  const { 
    announcements, 
    addAnnouncement, 
    updateAnnouncement, 
    toggleAnnouncement, 
    deleteAnnouncement 
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [bannerUrl, setBannerUrl] = useState('/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg');
  const [type, setType] = useState<'festival' | 'course_launch' | 'exam_alert' | 'general'>('festival');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2026-12-31');
  const [targetAudience, setTargetAudience] = useState<'all' | 'competitive' | 'foundation' | 'higher_education'>('all');
  const [popupDisplay, setPopupDisplay] = useState<'once' | 'repeated'>('once');
  const [ctaText, setCtaText] = useState('Explore Special Batches');
  const [ctaLink, setCtaLink] = useState('cat-upsc-ias-maths');

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setMessage('');
    setBannerUrl('/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg');
    setType('festival');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('2026-12-31');
    setTargetAudience('all');
    setPopupDisplay('once');
    setCtaText('Explore Special Batches');
    setCtaLink('cat-upsc-ias-maths');
    setShowModal(true);
  };

  const openEditModal = (ann: Announcement) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setMessage(ann.message);
    setBannerUrl(ann.bannerUrl || '');
    setType(ann.type);
    setStartDate(ann.startDate);
    setEndDate(ann.endDate);
    setTargetAudience(ann.targetAudience);
    setPopupDisplay(ann.popupDisplay);
    setCtaText(ann.ctaText || '');
    setCtaLink(ann.ctaLink || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    if (editingId) {
      await updateAnnouncement(editingId, {
        title: title.trim(),
        message: message.trim(),
        bannerUrl,
        type,
        startDate,
        endDate,
        targetAudience,
        popupDisplay,
        ctaText,
        ctaLink,
      });
    } else {
      await addAnnouncement({
        title: title.trim(),
        message: message.trim(),
        bannerUrl,
        type,
        startDate,
        endDate,
        targetAudience,
        popupDisplay,
        ctaText,
        ctaLink,
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Festivals & Scheduled Announcements</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {announcements.length} Active Alerts
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Publish time-sensitive banner campaigns, festive discounts, exam alerts, and launch popups
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((ann) => {
          const typeBadgeColor = 
            ann.type === 'festival' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
            ann.type === 'course_launch' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
            ann.type === 'exam_alert' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
            'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';

          return (
            <div
              key={ann.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                ann.isActive 
                  ? 'bg-[#12121a] border-zinc-800 hover:border-amber-500/40' 
                  : 'bg-[#0c0c12] border-zinc-900 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Banner Thumbnail */}
                {ann.bannerUrl && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-zinc-800">
                    <img src={ann.bannerUrl} alt={ann.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeBadgeColor} uppercase tracking-wider`}>
                      {ann.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      <span>{ann.startDate} to {ann.endDate}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      Popup: {ann.popupDisplay}
                    </span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-white">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-xl line-clamp-2">
                    {ann.message}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => toggleAnnouncement(ann.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                    ann.isActive
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {ann.isActive ? 'Active (Live)' : 'Disabled'}
                </button>

                <button
                  onClick={() => openEditModal(ann)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  title="Edit Announcement"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {announcements.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-[#101016] border border-zinc-800 p-6 space-y-2">
            <Bell className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">No announcements scheduled yet.</p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#12121a] border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
            <h3 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{editingId ? 'Edit Announcement' : 'Schedule New Announcement'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Diwali Mega Scholarship · 50% Off"
                  required
                  className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Message / Discount Details</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detailed offer, scholarship codes, launch dates..."
                  rows={3}
                  required
                  className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="festival">Festival / Holiday</option>
                    <option value="course_launch">Course Launch</option>
                    <option value="exam_alert">Exam Alert</option>
                    <option value="general">General Notice</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e: any) => setTargetAudience(e.target.value)}
                    className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Students</option>
                    <option value="competitive">Competitive Exams</option>
                    <option value="foundation">School Foundation</option>
                    <option value="higher_education">Higher Education</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Launch Popup Frequency</label>
                  <select
                    value={popupDisplay}
                    onChange={(e: any) => setPopupDisplay(e.target.value)}
                    className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="once">Once per session</option>
                    <option value="repeated">Every app launch</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Claim 50% Off"
                    className="w-full bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Direct Banner Upload & Preview */}
              <div className="space-y-2 p-3 bg-black/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">
                    Banner Artwork
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-semibold flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload from Device</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result === 'string') {
                          setBannerUrl(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <div className="w-24 h-14 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                    <img src={bannerUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="Or enter image URL"
                    className="flex-1 bg-[#0d0d12] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-2 px-3.5 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110"
                >
                  {editingId ? 'Save Changes' : 'Schedule Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
