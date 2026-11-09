import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { Course, LiveClass, LectureResource } from '../../types';
import { 
  X, 
  LayoutDashboard, 
  BookOpen, 
  Radio, 
  HelpCircle, 
  FileText, 
  Sparkles, 
  Users, 
  DollarSign, 
  Bell, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Send,
  Shield,
  Layers,
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminPortalProps {
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
  const { 
    courses, 
    liveClasses, 
    practiceTests, 
    notifications, 
    updateCoursePrice,
    addCourse,
    deleteCourse,
    scheduleLiveClass,
    addLectureResource,
    answerDoubt,
    broadcastNotification,
    student
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'courses' | 'students' | 'live' | 'doubts' | 'notes' | 'tests' | 'ai' | 'broadcast'
  >('overview');

  // Course price editor state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [priceSuccessMsg, setPriceSuccessMsg] = useState<string | null>(null);

  // New Course Modal / Form state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<'Mathematics' | 'Programming' | 'Science' | 'Electronics'>('Mathematics');
  const [coursePrice, setCoursePrice] = useState('2499');
  const [courseOriginalPrice, setCourseOriginalPrice] = useState('6999');
  const [courseHours, setCourseHours] = useState('85');
  const [courseLectures, setCourseLectures] = useState('65');
  const [courseDesc, setCourseDesc] = useState('');

  // Live Class Scheduling state
  const [liveTitle, setLiveTitle] = useState('');
  const [liveCourseName, setLiveCourseName] = useState(courses[0]?.title || 'Complete Higher Mathematics');
  const [liveSubject, setLiveSubject] = useState('Calculus');
  const [liveScheduledTime, setLiveScheduledTime] = useState('Tomorrow, 6:00 PM IST');
  const [liveStreamUrl, setLiveStreamUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [liveSuccessMsg, setLiveSuccessMsg] = useState(false);

  // Doubt reply state
  const [doubtReply, setDoubtReply] = useState<Record<string, string>>({});
  const [replySuccessMsg, setReplySuccessMsg] = useState<Record<string, boolean>>({});

  // Notes PDF assignment state
  const [selectedCourseForPdf, setSelectedCourseForPdf] = useState(courses[0]?.id || '');
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfPages, setPdfPages] = useState('16');
  const [pdfFileSize, setPdfFileSize] = useState('3.8 MB');
  const [pdfSuccessMsg, setPdfSuccessMsg] = useState(false);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Dummy student roster for student management tab
  const [studentsList, setStudentsList] = useState([
    {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      batch: 'Calculus & Higher Math Batch 2026',
      status: 'Active',
      joined: student.enrolledDate,
      streak: student.streakDays,
    },
    {
      id: 'stu-102',
      name: 'Aman Verma',
      email: 'aman.verma@example.com',
      phone: '+91 98112 34567',
      batch: 'Full Stack Python & DSA Masterclass',
      status: 'Active',
      joined: '12 Jan 2026',
      streak: 19,
    },
    {
      id: 'stu-103',
      name: 'Priya Joshi',
      email: 'priya.joshi@example.com',
      phone: '+91 98223 45678',
      batch: 'Classical Mechanics & Electrodynamics',
      status: 'Active',
      joined: '02 Feb 2026',
      streak: 11,
    },
    {
      id: 'stu-104',
      name: 'Rohit K. Sharma',
      email: 'rohit.sharma@example.com',
      phone: '+91 98334 56789',
      batch: 'Digital Electronics & Logic Design',
      status: 'Active',
      joined: '18 Feb 2026',
      streak: 7,
    },
  ]);

  const handleUpdatePrice = (courseId: string) => {
    updateCoursePrice(courseId, newPrice);
    setEditingCourseId(null);
    setPriceSuccessMsg(`Price updated to ₹${newPrice.toLocaleString()} live in student catalog.`);
    setTimeout(() => setPriceSuccessMsg(null), 3000);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const newCourseItem: Course = {
      id: `course-${Date.now()}`,
      title: courseTitle.trim(),
      category: courseCategory,
      instructor: {
        name: BRAND_ASSETS.leadInstructor.name,
        title: BRAND_ASSETS.leadInstructor.designation,
        avatarUrl: BRAND_ASSETS.teacherPortrait,
        experience: '8+ Years',
        bio: BRAND_ASSETS.leadInstructor.credentials,
      },
      thumbnailUrl: courses[0]?.thumbnailUrl || BRAND_ASSETS.logo,
      bannerUrl: BRAND_ASSETS.logo,
      price: parseInt(coursePrice, 10) || 1999,
      originalPrice: parseInt(courseOriginalPrice, 10) || 5999,
      rating: 4.9,
      reviewCount: 320,
      durationHours: parseInt(courseHours, 10) || 50,
      totalLectures: parseInt(courseLectures, 10) || 45,
      totalNotes: 25,
      totalTests: 12,
      level: 'Intermediate',
      language: 'Bilingual (Hinglish)',
      description: courseDesc || 'Comprehensive academic course curriculum designed by Er. Alifer Sir.',
      features: [
        'Live doubt clearance & interactive sessions',
        'Structured chapter-wise PDF handwritten notes',
        'Full length simulated test papers with video solutions',
      ],
      isEnrolled: false,
      progressPercent: 0,
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          courseId: `course-${Date.now()}`,
          title: 'Module 1: Foundations & Core Concepts',
          order: 1,
          chapters: [
            {
              id: `ch-${Date.now()}-1`,
              moduleId: `mod-${Date.now()}-1`,
              title: 'Chapter 1: Conceptual Architecture',
              order: 1,
              lectures: [
                {
                  id: `lec-${Date.now()}-1`,
                  chapterId: `ch-${Date.now()}-1`,
                  courseId: `course-${Date.now()}`,
                  title: '01. Comprehensive Course Orientation',
                  durationMinutes: 45,
                  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                  thumbnailUrl: courses[0]?.thumbnailUrl || BRAND_ASSETS.logo,
                  description: 'Welcome and full roadmap for cracking exam hurdles.',
                  order: 1,
                  resources: [
                    {
                      id: `res-${Date.now()}-1`,
                      title: 'Course Syllabus & Blueprint 2026',
                      type: 'pdf',
                      fileSize: '2.5 MB',
                      pages: 8,
                    },
                  ],
                  queries: [],
                },
              ],
            },
          ],
        },
      ],
    };

    addCourse(newCourseItem);
    setShowAddCourseModal(false);
    setCourseTitle('');
    setCourseDesc('');
  };

  const handleScheduleLiveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim()) return;

    const newLive: LiveClass = {
      id: `live-${Date.now()}`,
      title: liveTitle.trim(),
      courseName: liveCourseName,
      subject: liveSubject,
      instructorName: BRAND_ASSETS.leadInstructor.name,
      instructorAvatar: BRAND_ASSETS.teacherPortrait,
      scheduledTime: liveScheduledTime,
      status: 'upcoming',
      streamUrl: liveStreamUrl,
      viewerCount: 0,
      handouts: [
        {
          id: `handout-${Date.now()}`,
          title: `${liveTitle} - Live Class Handout & Practice Problems`,
          type: 'pdf',
          fileSize: '3.4 MB',
          pages: 14,
        },
      ],
    };

    scheduleLiveClass(newLive);
    setLiveSuccessMsg(true);
    setLiveTitle('');
    setTimeout(() => setLiveSuccessMsg(false), 3500);
  };

  const handlePostReply = (courseId: string, lectureId: string, queryId: string) => {
    const text = doubtReply[queryId];
    if (!text?.trim()) return;

    answerDoubt(courseId, lectureId, queryId, text.trim());
    setReplySuccessMsg(prev => ({ ...prev, [queryId]: true }));
    setTimeout(() => {
      setReplySuccessMsg(prev => ({ ...prev, [queryId]: false }));
    }, 3000);
  };

  const handleAssignPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitle.trim()) return;

    const targetCourse = courses.find(c => c.id === selectedCourseForPdf) || courses[0];
    if (!targetCourse || !targetCourse.modules[0]?.chapters[0]?.lectures[0]) return;

    const lectureId = targetCourse.modules[0].chapters[0].lectures[0].id;
    const newRes: LectureResource = {
      id: `res-manual-${Date.now()}`,
      title: pdfTitle.trim(),
      type: 'pdf',
      fileSize: pdfFileSize,
      pages: parseInt(pdfPages, 10) || 12,
    };

    addLectureResource(targetCourse.id, lectureId, newRes);
    setPdfSuccessMsg(true);
    setPdfTitle('');
    setTimeout(() => setPdfSuccessMsg(false), 3500);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    broadcastNotification(broadcastTitle.trim(), broadcastMessage.trim());
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastTitle('');
      setBroadcastMessage('');
      setBroadcastSent(false);
    }, 3000);
  };

  // Collect all student queries across courses
  const allQueries: Array<{ courseId: string; lectureId: string; lectureTitle: string; courseTitle: string; query: any }> = [];
  courses.forEach(c => c.modules.forEach(m => m.chapters.forEach(ch => ch.lectures.forEach(l => {
    l.queries.forEach(q => {
      allQueries.push({ 
        courseId: c.id, 
        lectureId: l.id, 
        lectureTitle: l.title,
        courseTitle: c.title,
        query: q 
      });
    });
  }))));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#08080c] text-white animate-in fade-in duration-150">
      {/* Top Admin Navigation Bar */}
      <div className="h-14 bg-[#0e0e14] border-b border-amber-500/20 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Student App</span>
          </button>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="font-display text-xs sm:text-sm font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
              ALIFER ACADEMY · ACADEMIC ADMIN CONSOLE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden md:inline px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
            Environment: Production-Live Sync
          </span>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white"
            title="Exit admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Admin Workspace Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Admin Navigation Sidebar */}
        <aside className="w-56 sm:w-64 bg-[#0a0a0f] border-r border-zinc-800/90 flex flex-col justify-between shrink-0 p-3 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              Management Modules
            </div>

            {[
              { id: 'overview', label: 'Admin Dashboard', icon: LayoutDashboard },
              { id: 'courses', label: `Course & Pricing (${courses.length})`, icon: BookOpen },
              { id: 'students', label: `Student Roster (${studentsList.length})`, icon: Users },
              { id: 'live', label: `Live Studio (${liveClasses.length})`, icon: Radio },
              { id: 'doubts', label: `Doubt Queue (${allQueries.length})`, icon: HelpCircle },
              { id: 'notes', label: 'Assign Notes & PDFs', icon: FileText },
              { id: 'tests', label: `Test Zone (${practiceTests.length})`, icon: Layers },
              { id: 'ai', label: 'Alifer AI Config', icon: Sparkles },
              { id: 'broadcast', label: 'Broadcast Alert', icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Admin Identity Footer */}
          <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-[11px] space-y-1">
            <span className="text-zinc-400 block font-medium">Logged in as:</span>
            <div className="font-bold text-white">Er. Alifer Sir</div>
            <div className="text-[10px] text-amber-400">Academy Director</div>
          </div>
        </aside>

        {/* Right Main Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#08080c] space-y-6">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Academy Metrics & Overview
                </h2>
                <p className="text-xs text-zinc-400">
                  Real-time operational status for student admissions, live classes, and doubt queues.
                </p>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Students</span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-1 tabular-nums">
                    54,820
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12.4% this month</span>
                  </span>
                </div>

                <div className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Active Batches</span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400 mt-1 tabular-nums">
                    {courses.length} Courses
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 block">Full Syllabus Enabled</span>
                </div>

                <div className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Pending Doubts</span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">
                    {allQueries.filter(q => q.query.status !== 'answered').length}
                  </div>
                  <span className="text-[10px] text-cyan-400 mt-1 block">Ready for reply</span>
                </div>

                <div className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Alifer AI Engine</span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-purple-400 mt-1 tabular-nums">
                    142,500
                  </div>
                  <span className="text-[10px] text-purple-400 mt-1 block">Gemini 3.8 Flash API</span>
                </div>
              </div>

              {/* Quick Operational Shortcuts */}
              <div className="p-5 bg-gradient-to-r from-amber-950/20 via-[#14141e] to-black border border-amber-500/30 rounded-2xl space-y-3">
                <h3 className="font-display text-sm font-bold text-amber-300">
                  Direct Administrator Actions
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveAdminTab('live')}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
                  >
                    Schedule Live Class
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('courses')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors"
                  >
                    Manage Course Pricing & Add Course
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('doubts')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors"
                  >
                    Review Student Doubts Queue
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('broadcast')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors"
                  >
                    Broadcast Announcement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSE & PRICING MANAGEMENT */}
          {activeAdminTab === 'courses' && (
            <div className="space-y-4 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-white">
                    Course Syllabus & Pricing Management
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Update prices live across student apps, create new syllabus offerings, or remove old modules.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Course</span>
                </button>
              </div>

              {priceSuccessMsg && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{priceSuccessMsg}</span>
                </div>
              )}

              {/* Add New Course Modal */}
              {showAddCourseModal && (
                <div className="p-4 bg-[#14141e] border-2 border-amber-500/40 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-amber-300">Create New Academic Course</h3>
                    <button onClick={() => setShowAddCourseModal(false)} className="text-zinc-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-zinc-400 block mb-1">Course Title</label>
                        <input
                          type="text"
                          required
                          value={courseTitle}
                          onChange={(e) => setCourseTitle(e.target.value)}
                          placeholder="e.g. Master Differential Equations & Linear Algebra"
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Category</label>
                        <select
                          value={courseCategory}
                          onChange={(e) => setCourseCategory(e.target.value as any)}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="Mathematics">Mathematics</option>
                          <option value="Programming">Programming</option>
                          <option value="Science">Science</option>
                          <option value="Electronics">Electronics</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-zinc-400 block mb-1">Price (₹)</label>
                        <input
                          type="number"
                          value={coursePrice}
                          onChange={(e) => setCoursePrice(e.target.value)}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={courseOriginalPrice}
                          onChange={(e) => setCourseOriginalPrice(e.target.value)}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Duration (Hours)</label>
                        <input
                          type="number"
                          value={courseHours}
                          onChange={(e) => setCourseHours(e.target.value)}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Lectures Count</label>
                        <input
                          type="number"
                          value={courseLectures}
                          onChange={(e) => setCourseLectures(e.target.value)}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-zinc-400 block mb-1">Description</label>
                      <textarea
                        value={courseDesc}
                        onChange={(e) => setCourseDesc(e.target.value)}
                        placeholder="Comprehensive academic overview..."
                        rows={2}
                        className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCourseModal(false)}
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold"
                      >
                        Save Course
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3">
                {courses.map((c) => {
                  const isEditing = editingCourseId === c.id;

                  return (
                    <div
                      key={c.id}
                      className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-500/30 shrink-0 bg-black">
                          <img src={c.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold text-amber-400 uppercase">
                            {c.category} · {c.level}
                          </span>
                          <h4 className="text-sm font-bold text-white truncate">{c.title}</h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {c.totalLectures} Lectures · {c.durationHours} Hours · {c.modules.length} Modules
                          </p>
                        </div>
                      </div>

                      {/* Pricing Edit Field and Actions */}
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-amber-400 font-bold">₹</span>
                            <input
                              type="number"
                              value={newPrice}
                              onChange={(e) => setNewPrice(parseInt(e.target.value, 10) || 0)}
                              className="w-24 bg-black border border-amber-400 rounded-lg px-2 py-1 text-xs text-white font-mono"
                            />
                            <button
                              onClick={() => handleUpdatePrice(c.id)}
                              className="p-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400"
                              title="Confirm price"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingCourseId(null)}
                              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="font-mono text-base font-bold text-amber-400 block">
                                ₹{c.price.toLocaleString()}
                              </span>
                              <span className="font-mono text-[10px] text-zinc-500 line-through">
                                ₹{c.originalPrice.toLocaleString()}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setEditingCourseId(c.id);
                                setNewPrice(c.price);
                              }}
                              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-800 text-xs flex items-center gap-1"
                              title="Edit price"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Edit Price</span>
                            </button>
                            {courses.length > 1 && (
                              <button
                                onClick={() => deleteCourse(c.id)}
                                className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-zinc-800 text-xs"
                                title="Delete course"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: STUDENT MANAGEMENT */}
          {activeAdminTab === 'students' && (
            <div className="space-y-4 max-w-5xl">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Enrolled Students & Activity Roster
                </h2>
                <p className="text-xs text-zinc-400">
                  Track student enrollments, attendance streaks, and account status across active batches.
                </p>
              </div>

              <div className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] font-semibold">
                      <th className="pb-3 pl-2">Student Name</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Enrolled Batch</th>
                      <th className="pb-3">Streak</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {studentsList.map((st) => (
                      <tr key={st.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 pl-2">
                          <div className="font-bold text-white">{st.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">ID: {st.id}</div>
                        </td>
                        <td className="py-3 text-zinc-300">
                          <div>{st.email}</div>
                          <div className="text-[10px] text-zinc-500">{st.phone}</div>
                        </td>
                        <td className="py-3 text-amber-300 font-medium">
                          {st.batch}
                        </td>
                        <td className="py-3 font-mono text-zinc-300">
                          🔥 {st.streak} Days
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            st.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {st.status}
                          </span>
                        </td>
                        <td className="py-3 pr-2">
                          <button
                            onClick={() => {
                              setStudentsList(prev => prev.map(s => s.id === st.id ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s));
                            }}
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 border border-zinc-800"
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE STREAM STUDIO */}
          {activeAdminTab === 'live' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Live Stream Studio & Session Scheduler
                </h2>
                <p className="text-xs text-zinc-400">
                  Schedule new YouTube Live or RTMP interactive lecture broadcasts. Appears live on the student app immediately.
                </p>
              </div>

              {liveSuccessMsg && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Live session scheduled! Students notified and listed under Live Classes.</span>
                </div>
              )}

              {/* Schedule Live Class Form */}
              <form onSubmit={handleScheduleLiveClass} className="p-4 bg-[#111117] border border-amber-500/30 rounded-2xl space-y-3 text-xs">
                <h3 className="text-sm font-bold text-amber-300">Schedule Upcoming Live Session</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1">Session Headline</label>
                    <input
                      type="text"
                      required
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      placeholder="e.g. Definite Integration Masterclass - King Property"
                      className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Subject Focus</label>
                    <input
                      type="text"
                      value={liveSubject}
                      onChange={(e) => setLiveSubject(e.target.value)}
                      placeholder="Calculus / Electrodynamics / DSA"
                      className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1">Associated Course</label>
                    <select
                      value={liveCourseName}
                      onChange={(e) => setLiveCourseName(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.title}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">Broadcast Schedule Time</label>
                    <input
                      type="text"
                      value={liveScheduledTime}
                      onChange={(e) => setLiveScheduledTime(e.target.value)}
                      placeholder="e.g. Today, 7:00 PM IST"
                      className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!liveTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-2"
                >
                  <Radio className="w-4 h-4" />
                  <span>Publish & Schedule Live Stream</span>
                </button>
              </form>

              {/* Existing Live Sessions List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Active & Scheduled Live Sessions
                </h4>
                {liveClasses.map((lc) => (
                  <div
                    key={lc.id}
                    className="p-3.5 bg-[#111117] border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white">{lc.title}</h5>
                        <p className="text-[11px] text-zinc-400">
                          {lc.courseName} · {lc.scheduledTime} · {lc.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lc.status === 'live' ? 'bg-rose-500 text-black' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {lc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DOUBT RESOLUTION QUEUE */}
          {activeAdminTab === 'doubts' && (
            <div className="space-y-4 max-w-5xl">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Student Doubts & Academic Queries Queue
                </h2>
                <p className="text-xs text-zinc-400">
                  Review student questions submitted under lecture videos and post official educator replies. Replies synchronize to the video player in real time.
                </p>
              </div>

              <div className="space-y-3">
                {allQueries.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-900/30 rounded-2xl">
                    No student queries posted yet.
                  </div>
                ) : (
                  allQueries.map(({ courseId, lectureId, lectureTitle, courseTitle, query }) => {
                    const isAnswered = query.status === 'answered';

                    return (
                      <div
                        key={query.id}
                        className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-white">{query.studentName}</span>
                            <span className="text-zinc-500 text-[11px] ml-2 font-mono">
                              {courseTitle} · {lectureTitle}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold self-start sm:self-auto ${
                            isAnswered ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {isAnswered ? 'Answered' : 'Awaiting Reply'}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-200">{query.question}</p>

                        {/* Existing reply or reply input */}
                        {isAnswered && query.teacherReply ? (
                          <div className="p-3 bg-zinc-950/70 rounded-xl border border-zinc-800 text-xs text-zinc-300">
                            <span className="font-bold text-amber-400 block mb-1">
                              Official Educator Reply ({query.teacherReply.author}):
                            </span>
                            {query.teacherReply.text}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {replySuccessMsg[query.id] && (
                              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Reply posted live to student!</span>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={doubtReply[query.id] || ''}
                                onChange={(e) => setDoubtReply({ ...doubtReply, [query.id]: e.target.value })}
                                placeholder="Type Er. Alifer Sir's official explanation..."
                                className="flex-1 bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                              />
                              <button
                                onClick={() => handlePostReply(courseId, lectureId, query.id)}
                                disabled={!doubtReply[query.id]?.trim()}
                                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs"
                              >
                                Post Reply
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 6: NOTES & STUDY PDFS ASSIGNMENT */}
          {activeAdminTab === 'notes' && (
            <div className="space-y-4 max-w-4xl text-xs">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Assign Notes & PDF Study Handouts
                </h2>
                <p className="text-zinc-400">
                  Upload and assign lecture notes and formula packages to specific courses and chapters.
                </p>
              </div>

              {pdfSuccessMsg && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PDF assigned! It now appears under lecture resources for enrolled students.</span>
                </div>
              )}

              <form onSubmit={handleAssignPdf} className="p-4 bg-[#111117] border border-amber-500/20 rounded-2xl space-y-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold block">Target Course</label>
                  <select
                    value={selectedCourseForPdf}
                    onChange={(e) => setSelectedCourseForPdf(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold block">PDF Document Title</label>
                  <input
                    type="text"
                    required
                    value={pdfTitle}
                    onChange={(e) => setPdfTitle(e.target.value)}
                    placeholder="e.g. Definite Integrals - Full Solved Example Booklet"
                    className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">Page Count</label>
                    <input
                      type="number"
                      value={pdfPages}
                      onChange={(e) => setPdfPages(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-semibold block mb-1">File Size</label>
                    <input
                      type="text"
                      value={pdfFileSize}
                      onChange={(e) => setPdfFileSize(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!pdfTitle.trim()}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs"
                >
                  Assign PDF to Course
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: TEST ZONE ADMIN */}
          {activeAdminTab === 'tests' && (
            <div className="space-y-4 max-w-4xl text-xs">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Test Zone & Examination Papers
                </h2>
                <p className="text-zinc-400">
                  Manage mock tests, question banks, negative marking rules, and time constraints.
                </p>
              </div>

              <div className="space-y-3">
                {practiceTests.map((t) => (
                  <div key={t.id} className="p-4 bg-[#111117] border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white">{t.title}</h4>
                      <p className="text-[11px] text-zinc-400">
                        {t.subject} · {t.questionsCount} Questions · {t.durationMinutes} Mins · Total Marks: {t.totalMarks}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-amber-300 font-semibold">
                      {t.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: ALIFER AI CONFIG */}
          {activeAdminTab === 'ai' && (
            <div className="space-y-4 max-w-4xl text-xs">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  ALIFER AI ASSISTANT Configuration
                </h2>
                <p className="text-zinc-400">
                  Gemini API model parameters, subject grounding, and academic behavior limits.
                </p>
              </div>

              <div className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Model Architecture:</span>
                  <span className="font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-500/30">
                    gemini-3.8-flash (Server-Side)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Supported Modalities:</span>
                  <span className="text-zinc-300">Text & Handwritten Photo Uploads</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Language Processing:</span>
                  <span className="text-amber-300">Bilingual (English + Hindi + Hinglish)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">API Key Security:</span>
                  <span className="text-emerald-400 font-mono">Protected Server-Side Proxy (No client leaks)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BROADCAST PUSH NOTIFICATIONS */}
          {activeAdminTab === 'broadcast' && (
            <div className="space-y-4 max-w-xl text-xs">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Broadcast Push Notification
                </h2>
                <p className="text-zinc-400">
                  Send immediate alerts to all enrolled students. The alert will show up in the student notification bell immediately.
                </p>
              </div>

              <form onSubmit={handleBroadcast} className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl space-y-3">
                {broadcastSent && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Notification successfully sent! Appears live in student notifications.</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Alert Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="e.g. 🔴 Emergency Calculus Doubt Session Today"
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Message Body
                  </label>
                  <textarea
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={3}
                    placeholder="Provide details for students..."
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!broadcastTitle.trim() || !broadcastMessage.trim()}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast Alert</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
