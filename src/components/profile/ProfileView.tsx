import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { 
  User, 
  Award, 
  Settings, 
  CreditCard, 
  Heart, 
  FileText, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Flame, 
  Clock, 
  CheckCircle, 
  BookOpen,
  Edit2,
  Trash2,
  Shield,
  Camera,
  Download,
  Bell,
  MessageCircle,
  ExternalLink,
  Phone,
  Mail,
  ChevronDown,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { ConnectWithUs } from './ConnectWithUs';
import { CertificateModal } from './CertificateModal';
import { SettingsModal } from './SettingsModal';

export const ProfileView: React.FC = () => {
  const { 
    student, 
    updateStudent, 
    enrolledCourses, 
    courses,
    transactions,
    downloads, 
    openPdfViewer,
    setIsAdminOpen,
    setIsAuthOpen,
    setIsOnboardingOpen,
    setActiveTab,
    notifications,
    unreadNotificationCount,
    setIsNotificationOpen,
    openCheckout
  } = useApp();

  const [showCertificate, setShowCertificate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(student.name);
  const [editEmail, setEditEmail] = useState(student.email);
  const [editPhone, setEditPhone] = useState(student.phone);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateStudent({ avatarUrl: reader.result });
          setSaveSuccessMsg(true);
          setTimeout(() => setSaveSuccessMsg(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    updateStudent({ avatarUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      name: editName.trim() || student.name,
      email: editEmail.trim() || student.email,
      phone: editPhone.trim() || student.phone,
    });
    setShowEditProfileModal(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Compute initials avatar (e.g. 'MV' for Mayank Vaishno)
  const studentInitials = student.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST';

  // Has valid student avatar (strict rule: never owner's photo)
  const hasCustomAvatar = student.avatarUrl && 
    !student.avatarUrl.includes('WA0003') && 
    !student.avatarUrl.includes('teacher') &&
    student.avatarUrl.trim().length > 0;

  // Recommended courses for wishlist
  const wishlistCourses = courses.filter((c) => !c.isEnrolled).slice(0, 2);

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto animate-in fade-in duration-150">
      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Student profile changes saved securely.</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(false)} className="text-zinc-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* ==================================================
          SECTION 1: STUDENT PROFILE HEADER CARD
         ================================================== */}
      <section className="bg-gradient-to-r from-[#12121a] via-[#161624] to-[#0d0d14] border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Subtle decorative golden gradient accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          {/* Student Profile Photo or Initials Avatar Badge */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 bg-gradient-to-br from-amber-500/25 via-zinc-900 to-black flex items-center justify-center shadow-lg shadow-amber-500/10">
              {hasCustomAvatar ? (
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="font-display text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-wider">
                  {studentInitials}
                </span>
              )}
            </div>

            {/* Change / Upload Avatar Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 p-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black shadow-md transition-all active:scale-95"
              title="Upload your student photo"
              aria-label="Upload photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Student Details & Account Info */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
                {student.name}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {student.id}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Verified Student</span>
              </span>
            </div>

            <div className="text-xs text-zinc-400 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <span>{student.email}</span>
              </span>
              <span className="hidden sm:inline text-zinc-600">·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <span>{student.phone}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1.5 text-[11px] text-zinc-300">
              <span className="px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
                Skill Level: <strong className="text-amber-300">{student.skillLevel}</strong>
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
                Enrolled: {student.enrolledDate}
              </span>
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium transition-colors"
              >
                Change Goals
              </button>
            </div>
          </div>

          {/* Primary Quick Actions */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => {
                setEditName(student.name);
                setEditEmail(student.email);
                setEditPhone(student.phone);
                setShowEditProfileModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setShowCertificate(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Certificate</span>
            </button>
          </div>
        </div>

        {/* Learning Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-zinc-800/80 text-center">
          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Learning Streak</span>
            </span>
            <span className="font-mono text-base font-extrabold text-amber-400 tabular-nums block mt-0.5">
              {student.streakDays} Days
            </span>
          </div>

          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Watch Hours</span>
            </span>
            <span className="font-mono text-base font-extrabold text-cyan-400 tabular-nums block mt-0.5">
              {Math.round(student.totalStudyMinutes / 60)} hrs
            </span>
          </div>

          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lectures Done</span>
            </span>
            <span className="font-mono text-base font-extrabold text-emerald-400 tabular-nums block mt-0.5">
              {student.completedLecturesCount}
            </span>
          </div>

          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Active Batches</span>
            </span>
            <span className="font-mono text-base font-extrabold text-purple-400 tabular-nums block mt-0.5">
              {enrolledCourses.length}
            </span>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 2: MY PURCHASES & ENROLLED BATCHES
         ================================================== */}
      <section className="bg-[#101016] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
              My Purchases & Enrolled Batches
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('learning')}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Go to My Learning</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Enrolled Courses Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {enrolledCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveTab('learning')}
              className="p-3.5 bg-zinc-950/70 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/40 rounded-xl cursor-pointer transition-all flex items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 shrink-0 bg-black">
                <img src={c.thumbnailUrl} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-amber-400 font-semibold uppercase">{c.categoryName}</div>
                <h4 className="text-xs font-bold text-white truncate mt-0.5">{c.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                  <span>{c.progressPercent}% Completed</span>
                  <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                    Resume →
                  </span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
                    style={{ width: `${c.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Utilities Row: Invoices, Wishlist, Downloads, Certificates */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <button
            onClick={() => {
              const element = document.getElementById('payment-history-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-colors"
          >
            <CreditCard className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-xs font-bold text-white block">Tax Invoices</span>
            <span className="text-[10px] text-zinc-400">{transactions.length} Verified</span>
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="p-3 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-colors"
          >
            <Heart className="w-4 h-4 text-rose-400 mb-1" />
            <span className="text-xs font-bold text-white block">Wishlist</span>
            <span className="text-[10px] text-zinc-400">{wishlistCourses.length} Saved</span>
          </button>

          <button
            onClick={() => setActiveTab('learning')}
            className="p-3 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="text-xs font-bold text-white block">Offline Notes</span>
            <span className="text-[10px] text-zinc-400">{downloads.length} Saved</span>
          </button>

          <button
            onClick={() => setShowCertificate(true)}
            className="p-3 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-left transition-colors"
          >
            <Award className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-xs font-bold text-white block">Certificates</span>
            <span className="text-[10px] text-zinc-400">1 Issued</span>
          </button>
        </div>
      </section>

      {/* ==================================================
          SECTION 3: WISHLIST & EXPLORE NEW BATCHES
         ================================================== */}
      {wishlistCourses.length > 0 && (
        <section className="bg-[#101016] border border-zinc-800 rounded-2xl p-5 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                Wishlist & Recommended Batches
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('home')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Explore All Batches</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {wishlistCourses.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-800 shrink-0 bg-black">
                    <img src={c.thumbnailUrl} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white truncate">{c.title}</h4>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {c.categoryName} · {c.duration || '1 Year'} Access
                    </div>
                    <div className="text-amber-400 font-bold font-mono mt-0.5">
                      ₹{c.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openCheckout(c)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-extrabold text-[11px] shrink-0 shadow-md"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================================================
          SECTION 4: PAYMENT HISTORY & TAX INVOICES / RECEIPTS
         ================================================== */}
      <section id="payment-history-section" className="bg-[#101016] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
              Payment History & Official Tax Invoices
            </h2>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>100% Verified Ledger</span>
          </span>
        </div>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500 bg-zinc-950/40 rounded-xl border border-zinc-800">
              No payment transactions yet. When you enroll in an academic batch, your verified GST receipts, tax invoices, and order IDs will be securely listed here.
            </div>
          ) : (
            transactions.map((txn) => (
              <div
                key={txn.id}
                className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 text-[10px] mb-1">
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{txn.status === 'success' ? 'Payment Verified' : txn.status.toUpperCase()}</span>
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className="font-mono text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      {txn.receiptNumber}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{txn.courseTitle}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Order ID: <span className="font-mono text-zinc-300">{txn.orderId}</span> · Method: {txn.paymentMethod.toUpperCase()} · Date: {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span className="font-mono text-base font-extrabold text-amber-400">
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => openPdfViewer({
                      title: `Official Admission Receipt - ${txn.receiptNumber}`,
                      courseName: `${txn.courseTitle} (${txn.categoryName})`,
                      pages: 1,
                    })}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 font-semibold text-[11px] border border-zinc-800 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ==================================================
          SECTION 5: NOTIFICATIONS & BROADCAST ALERTS
         ================================================== */}
      <section className="bg-[#101016] border border-zinc-800 rounded-2xl p-5 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
              Academy Notifications & Alerts
            </h2>
          </div>
          {unreadNotificationCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
              {unreadNotificationCount} Unread
            </span>
          ) : (
            <span className="text-xs text-zinc-400 font-mono">All Caught Up</span>
          )}
        </div>

        <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">Broadcast Alerts & Class Announcements</h4>
            <p className="text-[11px] text-zinc-400">
              Receive live announcements from Er. Alifer Sir, exam schedules, and marathon notices.
            </p>
          </div>
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
          >
            <span>View Alerts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ==================================================
          SECTION 6: HELP AND SUPPORT & INTERACTIVE FAQS
         ================================================== */}
      <section className="bg-[#101016] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
              Help & Academic Support Desk
            </h2>
          </div>
          <span className="text-xs text-zinc-400">24/7 Student Desk</span>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-2">
          {[
            {
              q: 'How do I download lecture notes for offline reading?',
              a: 'Click "Save Offline" on any lecture notes or study material. The document will be available under My Learning > Study Materials and in your Profile Downloads with automatic page-bookmarking.',
            },
            {
              q: 'How do I ask Er. Alifer Sir my questions?',
              a: 'You can post queries directly under the lecture in the "Ask a Query" box, or interact with the ALIFER AI ASSISTANT in the top bar for instant step-by-step problem derivations.',
            },
            {
              q: 'Can I watch live class recordings if I miss the live session?',
              a: 'Yes! All live classes conducted by Er. Alifer Sir are recorded and posted to the Live Classes section under "Past Live Class Recordings" along with the lecture board notes.',
            },
            {
              q: 'How do I receive my verified course completion certificate?',
              a: 'Once you achieve 80% syllabus completion and submit the chapter practice tests, click the "Certificate" button in your profile to view, print, or download your verified credential.',
            },
          ].map((item, idx) => {
            const isOpen = activeFaqIndex === idx;

            return (
              <div key={idx} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40">
                <button
                  onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-zinc-200 hover:text-amber-300 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-2.5">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-emerald-950/20 hover:bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between text-emerald-300 text-xs font-bold transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Academic Support</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="mailto:support@aliferacademy.com"
            className="p-3 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between text-zinc-300 text-xs font-semibold transition-colors"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Email Academy Help Desk</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
          </a>
        </div>
      </section>

      {/* ==================================================
          SECTION 7: CONNECT WITH US (Official Social Channels)
         ================================================== */}
      <section className="bg-[#101016] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <ConnectWithUs />
      </section>

      {/* ==================================================
          SECTION 8: ABOUT ALIFER ACADEMY & ER. ALIFER SIR
         ================================================== */}
      <section className="bg-gradient-to-r from-[#12121a] to-[#0c0c12] border border-amber-500/25 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
              About Alifer Academy & Leadership
            </h2>
          </div>
          <span className="text-[10px] text-amber-400 font-mono uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Learning For All
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-1">
          {/* Official Portrait of Director Er. Alifer Sir clearly labeled */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/80 bg-black shrink-0 shadow-lg">
            <img
              src={BRAND_ASSETS.teacherPortrait}
              alt="Director Er. Alifer Sir"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1.5 text-center sm:text-left text-xs">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="font-display font-bold text-white text-sm">
                Er. Alifer Sir
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                Founder & Academic Director
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              Alifer Academy was established with the motto <strong className="text-amber-300">"Learning For All"</strong>. Under the guidance of Er. Alifer Sir, we provide structured, high-concept pedagogy across UPSC Mathematics Optional, CSAT Aptitude, Engineering Mathematics, and Higher Foundation courses.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[10px] text-zinc-400 font-mono">
              <span>· 50,000+ Students Mentored</span>
              <span>· 8+ Years Academic Excellence</span>
              <span>· New Delhi & Digital Pan-India</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 9: SETTINGS & PRIVACY
         ================================================== */}
      <section className="bg-[#101016] border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" />
            <h2 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
              Settings & Security
            </h2>
          </div>
          <span className="text-xs text-zinc-400">Preferences</span>
        </div>

        <div className="divide-y divide-zinc-800/80 text-xs">
          <div 
            onClick={() => setShowSettings(true)}
            className="py-3 flex items-center justify-between cursor-pointer hover:text-amber-300 transition-colors"
          >
            <div>
              <span className="font-semibold text-white block">Video Playback Preferences</span>
              <span className="text-[11px] text-zinc-400">Default 1080p Full HD resolution, autoplay next</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>

          <div 
            onClick={() => setShowSettings(true)}
            className="py-3 flex items-center justify-between cursor-pointer hover:text-amber-300 transition-colors"
          >
            <div>
              <span className="font-semibold text-white block">Download Preferences</span>
              <span className="text-[11px] text-zinc-400">Wi-Fi only downloads enabled</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>

          <div 
            onClick={() => setShowSettings(true)}
            className="py-3 flex items-center justify-between cursor-pointer hover:text-amber-300 transition-colors"
          >
            <div>
              <span className="font-semibold text-white block">Notification Settings</span>
              <span className="text-[11px] text-zinc-400">Live class alerts, new test announcements</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>

          <div 
            onClick={() => alert('All personal student data is encrypted and strictly protected under Alifer Academy Privacy Guidelines. No third-party data sharing.')}
            className="py-3 flex items-center justify-between cursor-pointer hover:text-amber-300 transition-colors"
          >
            <div>
              <span className="font-semibold text-white block">Privacy & Security Policies</span>
              <span className="text-[11px] text-zinc-400">End-to-end encrypted session and token validation</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>

          {/* Admin Switcher */}
          <div 
            onClick={() => setIsAdminOpen(true)}
            className="py-3 flex items-center justify-between cursor-pointer text-amber-300 hover:text-amber-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold block">Switch to Academy Director / Admin Console</span>
                <span className="text-[10px] text-zinc-400">Manage courses, lectures, PDF uploads & live sessions</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Secure Logout Button */}
        <div className="pt-2">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-rose-950/30 text-rose-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Student Logout</span>
          </button>
        </div>
      </section>

      {/* ==================================================
          MODALS: Edit Profile, Certificate, Settings, Logout
         ================================================== */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0e0e15] border border-amber-500/35 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <h3 className="font-display text-sm font-bold text-white">Edit Student Profile</h3>
              </div>
              <button onClick={() => setShowEditProfileModal(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold block">Full Student Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#121219] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold block">Registered Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#121219] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold block">Mobile / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#121219] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              {student.avatarUrl && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="text-rose-400 hover:underline text-[11px] flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove uploaded photo and revert to initials badge</span>
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-3.5 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-extrabold text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#121219] border border-zinc-800 rounded-2xl p-5 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-bold text-white">Confirm Student Logout</h3>
            <p className="text-xs text-zinc-400">
              Are you sure you want to log out of Alifer Academy? Your offline study notes, payment receipts, and test records will remain securely stored on your account.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setIsAuthOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {showCertificate && <CertificateModal onClose={() => setShowCertificate(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};
