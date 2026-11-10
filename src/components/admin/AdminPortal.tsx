import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { Course, LiveClass, LectureResource, PaymentTransaction, CourseDurationOption, DurationType } from '../../types';
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
  AlertCircle,
  Image as ImageIcon,
  Lock,
  LogOut,
  Key,
  CreditCard,
  Receipt,
  Upload,
  Eye,
  RefreshCw,
  Award
} from 'lucide-react';
import { CategoryManagementView } from './CategoryManagementView';
import { AnnouncementsManagementView } from './AnnouncementsManagementView';

interface AdminPortalProps {
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
  const { 
    courses, 
    categories,
    announcements,
    liveClasses, 
    practiceTests, 
    notifications, 
    updateCoursePrice,
    addCourse,
    deleteCourse,
    updateCourse,
    scheduleLiveClass,
    addLectureResource,
    answerDoubt,
    broadcastNotification,
    student,
    transactions,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    openPdfViewer
  } = useApp();

  // Simplified and organized admin navigation sections
  const [activeAdminTab, setActiveAdminTab] = useState<
    'categories' | 'courses' | 'admissions' | 'live' | 'doubts' | 'announcements' | 'overview' | 'students' | 'notes' | 'tests' | 'ai' | 'broadcast'
  >('categories');

  // Director Passcode Security State
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Course price quick editor state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [priceSuccessMsg, setPriceSuccessMsg] = useState<string | null>(null);

  // Course Delete Confirmation Modal
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Full Course Edit Modal State
  const [editingCourseFull, setEditingCourseFull] = useState<Course | null>(null);

  // New Course Modal / Form State
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || 'cat-upsc-ias-maths');
  const [courseCategory, setCourseCategory] = useState<'Mathematics' | 'Programming' | 'Science' | 'Electronics'>('Mathematics');
  const [coursePrice, setCoursePrice] = useState('1999');
  const [courseOriginalPrice, setCourseOriginalPrice] = useState('4999');
  const [courseLectures, setCourseLectures] = useState('45');
  const [courseDesc, setCourseDesc] = useState('');

  // Course Duration System State (Option A: Duration vs Option B: Period)
  const [courseDurationType, setCourseDurationType] = useState<DurationType>('duration');
  const [courseDurationOption, setCourseDurationOption] = useState<CourseDurationOption>('1 Year');
  const [courseCustomDuration, setCourseCustomDuration] = useState('18 Months');
  const [courseStartDate, setCourseStartDate] = useState('15 Jun 2026');
  const [courseEndDate, setCourseEndDate] = useState('31 Mar 2027');

  // Single Course Thumbnail System (Direct Device Upload / URL)
  const [courseThumbnailUrl, setCourseThumbnailUrl] = useState<string>(
    '/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg'
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // Live Class Scheduling state
  const [liveTitle, setLiveTitle] = useState('');
  const [liveCourseName, setLiveCourseName] = useState(courses[0]?.title || 'UPSC IAS Mathematics Optional');
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
  const [broadcastImage, setBroadcastImage] = useState<string>('');
  const [broadcastImageName, setBroadcastImageName] = useState<string>('');
  const [broadcastImageSize, setBroadcastImageSize] = useState<string>('');
  const [broadcastImageError, setBroadcastImageError] = useState<string>('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const broadcastFileInputRef = useRef<HTMLInputElement | null>(null);

  // Admissions Search state
  const [admissionsSearch, setAdmissionsSearch] = useState('');

  // Dummy student roster for student management tab
  const [studentsList, setStudentsList] = useState([
    {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      batch: 'UPSC IAS Maths Optional Batch 2026',
      status: 'Active',
      joined: student.enrolledDate,
      streak: student.streakDays,
    },
    {
      id: 'stu-102',
      name: 'Aman Verma',
      email: 'aman.verma@example.com',
      phone: '+91 98112 34567',
      batch: 'GATE–IES Engineering Mathematics',
      status: 'Active',
      joined: '12 Jan 2026',
      streak: 19,
    },
    {
      id: 'stu-103',
      name: 'Priya Joshi',
      email: 'priya.joshi@example.com',
      phone: '+91 98223 45678',
      batch: 'IIT-JEE Advanced Mathematics Marathon',
      status: 'Active',
      joined: '02 Feb 2026',
      streak: 11,
    },
    {
      id: 'stu-104',
      name: 'Rohit K. Sharma',
      email: 'rohit.sharma@example.com',
      phone: '+91 98334 56789',
      batch: 'NDA Mathematics Target Batch',
      status: 'Active',
      joined: '18 Feb 2026',
      streak: 7,
    },
  ]);

  // Handle image upload from device for new course
  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCourseThumbnailUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload from device for editing course
  const handleEditDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingCourseFull) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditingCourseFull({ ...editingCourseFull, thumbnailUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePrice = (courseId: string) => {
    updateCoursePrice(courseId, newPrice);
    setEditingCourseId(null);
    setPriceSuccessMsg(`Price updated to ₹${newPrice.toLocaleString()} live in student catalog.`);
    setTimeout(() => setPriceSuccessMsg(null), 3000);
  };

  // Compute resolved duration string based on duration type
  const getResolvedDuration = (
    type: DurationType,
    option: CourseDurationOption,
    custom: string,
    start: string,
    end: string
  ): string => {
    if (type === 'period') {
      return `${start} – ${end}`;
    }
    return option === 'Custom' ? custom || '1 Year' : option;
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const selectedCat = categories.find((c) => c.id === selectedCategoryId) || categories[0];
    const resolvedDuration = getResolvedDuration(
      courseDurationType,
      courseDurationOption,
      courseCustomDuration,
      courseStartDate,
      courseEndDate
    );

    const newCourseItem: Course = {
      id: `course-${Date.now()}`,
      title: courseTitle.trim(),
      categoryId: selectedCat?.id || 'cat-upsc-ias-maths',
      categoryName: selectedCat?.name || 'UPSC IAS Maths',
      categoryGroup: selectedCat?.group || 'Competitive Examinations',
      category: courseCategory,
      isPublished: true,
      isActive: true,
      instructor: {
        name: BRAND_ASSETS.leadInstructor.name,
        title: BRAND_ASSETS.leadInstructor.designation,
        avatarUrl: BRAND_ASSETS.teacherPortrait,
        experience: '8+ Years',
        bio: BRAND_ASSETS.leadInstructor.credentials,
      },
      // STRICT REQUIREMENT: ONE COURSE = ONE THUMBNAIL
      thumbnailUrl: courseThumbnailUrl || BRAND_ASSETS.teacherPortrait,
      bannerUrl: courseThumbnailUrl || BRAND_ASSETS.teacherPortrait,
      price: parseInt(coursePrice, 10) || 1999,
      originalPrice: parseInt(courseOriginalPrice, 10) || 4999,
      rating: 4.9,
      reviewCount: 320,

      // Time duration strictly enforced
      duration: resolvedDuration,
      durationType: courseDurationType,
      startDate: courseDurationType === 'period' ? courseStartDate : undefined,
      endDate: courseDurationType === 'period' ? courseEndDate : undefined,

      durationHours: 60,
      totalLectures: parseInt(courseLectures, 10) || 45,
      totalNotes: 25,
      totalTests: 12,
      level: 'Intermediate',
      language: 'Bilingual (Hinglish + English Notes)',
      description: courseDesc || 'Comprehensive academic course curriculum designed by Er. Alifer Sir.',
      features: [
        'Live doubt clearance & interactive sessions with Er. Alifer Sir',
        'Structured chapter-wise PDF handwritten notes',
        'Full-length simulated test papers with video solutions',
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
                  thumbnailUrl: courseThumbnailUrl,
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
    setPriceSuccessMsg(`Course "${newCourseItem.title}" created successfully under ${newCourseItem.categoryName}!`);
    setTimeout(() => setPriceSuccessMsg(null), 3500);
  };

  const handleSaveEditedCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseFull) return;

    await updateCourse(editingCourseFull.id, editingCourseFull);
    setEditingCourseFull(null);
    setPriceSuccessMsg(`Course updated successfully!`);
    setTimeout(() => setPriceSuccessMsg(null), 3000);
  };

  const handleConfirmDeleteCourse = () => {
    if (!courseToDelete) return;
    deleteCourse(courseToDelete.id);
    setCourseToDelete(null);
    setPriceSuccessMsg('Course deleted successfully.');
    setTimeout(() => setPriceSuccessMsg(null), 3000);
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

  const handleBroadcastImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format: JPG, JPEG, PNG, WebP
    const validExtensions = /\.(jpe?g|png|webp)$/i;
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validMimes.includes(file.type.toLowerCase()) && !validExtensions.test(file.name)) {
      setBroadcastImageError('Invalid file format. Please upload a JPG, JPEG, PNG, or WebP image file.');
      return;
    }

    // Validate file size: 5MB maximum
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setBroadcastImageError(`Selected file is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.`);
      return;
    }

    setBroadcastImageError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setBroadcastImage(reader.result);
        setBroadcastImageName(file.name);
        setBroadcastImageSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBroadcastImage = () => {
    setBroadcastImage('');
    setBroadcastImageName('');
    setBroadcastImageSize('');
    setBroadcastImageError('');
    if (broadcastFileInputRef.current) {
      broadcastFileInputRef.current.value = '';
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    setIsBroadcasting(true);
    try {
      await broadcastNotification(
        broadcastTitle.trim(),
        broadcastMessage.trim(),
        broadcastImage || undefined
      );
      setBroadcastSent(true);
      setTimeout(() => {
        setBroadcastTitle('');
        setBroadcastMessage('');
        handleRemoveBroadcastImage();
        setBroadcastSent(false);
      }, 3500);
    } finally {
      setIsBroadcasting(false);
    }
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setIsLoggingIn(true);
    setPasscodeError(null);
    const result = await loginAdmin(passcode.trim());
    setIsLoggingIn(false);
    if (!result.success) {
      setPasscodeError(result.error || 'Incorrect Director Passcode');
    }
  };

  // Filter admissions/transactions
  const filteredTransactions = transactions.filter((t) => {
    if (!admissionsSearch.trim()) return true;
    const q = admissionsSearch.toLowerCase();
    return (
      t.studentName.toLowerCase().includes(q) ||
      t.courseTitle.toLowerCase().includes(q) ||
      t.receiptNumber.toLowerCase().includes(q) ||
      t.orderId.toLowerCase().includes(q) ||
      t.studentEmail.toLowerCase().includes(q)
    );
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.status === 'success' ? t.amount : 0), 0);
  const totalVerifiedAdmissions = transactions.filter((t) => t.status === 'success').length;

  // Director Passcode Authentication Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md text-white animate-fadeIn">
        <div className="w-full max-w-md bg-[#12121a] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
              Director Authorization Required
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white pt-1">
              Admin & Course Console
            </h2>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Please enter the Director Security Passcode to manage categories, courses, pricing, and admissions.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5 flex items-center justify-between">
                <span>Security Passcode</span>
                <span className="text-[10px] text-amber-400 font-mono">Hint: ALIFER2026</span>
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter ALIFER2026"
                  required
                  autoFocus
                  className="w-full bg-[#0d0d12] border border-zinc-700 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors font-mono tracking-widest"
                />
              </div>
              {passcodeError && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{passcodeError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>{isLoggingIn ? 'Authenticating...' : 'Unlock Director Console'}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Alifer Academy Security Engine</span>
            <button onClick={onClose} className="hover:text-white underline">
              Return to Student View
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => logoutAdmin()}
            className="py-1 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-colors flex items-center gap-1 text-[11px]"
            title="Lock Director session"
          >
            <Lock className="w-3 h-3" />
            <span>Lock</span>
          </button>
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
        {/* Left Admin Navigation Sidebar - Organised into clear logical groups */}
        <aside className="w-56 sm:w-64 bg-[#0a0a0f] border-r border-zinc-800/90 flex flex-col justify-between shrink-0 p-3 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              Academic Operations
            </div>

            {[
              { id: 'categories', label: `Course Categories (${categories.length})`, icon: Layers },
              { id: 'courses', label: `All Courses & Batches (${courses.length})`, icon: BookOpen },
              { id: 'admissions', label: `Admissions & Payments (${transactions.length})`, icon: Receipt },
              { id: 'live', label: `Live Classes (${liveClasses.length})`, icon: Radio },
              { id: 'doubts', label: `Doubt Queue (${allQueries.length})`, icon: HelpCircle },
              { id: 'announcements', label: `Announcements & Banners (${announcements.length})`, icon: Sparkles },
              { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
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

            <div className="pt-3 px-3 py-2 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              Student Utilities
            </div>

            {[
              { id: 'students', label: `Student Roster (${studentsList.length})`, icon: Users },
              { id: 'notes', label: 'Assign Notes & PDFs', icon: FileText },
              { id: 'tests', label: `Test Zone (${practiceTests.length})`, icon: CheckCircle2 },
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
          {/* TAB 1: MANAGE CATEGORIES */}
          {activeAdminTab === 'categories' && <CategoryManagementView />}

          {/* TAB 2: ALL COURSES & BATCHES */}
          {activeAdminTab === 'courses' && (
            <div className="space-y-4 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-white">
                    All Courses & Batches Management
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Create courses with direct device thumbnail upload, time duration (Option A or B), and real pricing.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-extrabold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Course</span>
                </button>
              </div>

              {priceSuccessMsg && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{priceSuccessMsg}</span>
                </div>
              )}

              {/* CREATE COURSE MODAL / FORM */}
              {showAddCourseModal && (
                <div className="p-5 bg-[#12121c] border-2 border-amber-500/40 rounded-2xl space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">
                        Create New Academic Batch
                      </h3>
                    </div>
                    <button onClick={() => setShowAddCourseModal(false)} className="text-zinc-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                    {/* Course Title & Target Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-zinc-300 font-semibold block mb-1">
                          Course Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={courseTitle}
                          onChange={(e) => setCourseTitle(e.target.value)}
                          placeholder="e.g. UPSC IAS Mathematics Optional (Paper I & II)"
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-300 font-semibold block mb-1">
                          Assign Category *
                        </label>
                        <select
                          value={selectedCategoryId}
                          onChange={(e) => setSelectedCategoryId(e.target.value)}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name} ({cat.group})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* DIRECT THUMBNAIL SYSTEM: Device File Upload & Preview */}
                    <div className="p-4 bg-black/50 border border-amber-500/30 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-bold text-amber-400 block">
                            Course Thumbnail (Direct Device Upload)
                          </label>
                          <span className="text-[10px] text-zinc-400">
                            Strict rule: 1 Course = 1 Thumbnail. Displayed with 16:9 aspect ratio.
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose from Device</span>
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleDeviceImageUpload}
                        className="hidden"
                      />

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Thumbnail Live Preview */}
                        <div className="relative w-full sm:w-52 aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                          <img
                            src={courseThumbnailUrl}
                            alt="Selected thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 left-1.5">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-black/80 text-amber-300">
                              Preview
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 w-full space-y-1.5">
                          <label className="text-[11px] text-zinc-400 block">
                            Or paste image URL / artwork link:
                          </label>
                          <input
                            type="text"
                            value={courseThumbnailUrl}
                            onChange={(e) => setCourseThumbnailUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                          <p className="text-[10px] text-zinc-500">
                            The single selected thumbnail will be displayed on course cards, category lists, and the checkout screen without distortion.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* DURATION SYSTEM: Option A (Duration) vs Option B (Period) */}
                    <div className="p-4 bg-black/50 border border-zinc-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-amber-400 block">
                          Course Duration System *
                        </label>
                        <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setCourseDurationType('duration')}
                            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                              courseDurationType === 'duration'
                                ? 'bg-amber-500 text-black'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            Option A: Time Duration
                          </button>
                          <button
                            type="button"
                            onClick={() => setCourseDurationType('period')}
                            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                              courseDurationType === 'period'
                                ? 'bg-amber-500 text-black'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            Option B: Course Period
                          </button>
                        </div>
                      </div>

                      {courseDurationType === 'duration' ? (
                        <div className="space-y-2">
                          <span className="text-[11px] text-zinc-400 block">
                            Select official validity duration:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {(['3 Months', '6 Months', '1 Year', '2 Years', 'Custom'] as CourseDurationOption[]).map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setCourseDurationOption(opt)}
                                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors text-center ${
                                  courseDurationOption === opt
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          {courseDurationOption === 'Custom' && (
                            <div className="pt-2">
                              <label className="text-[11px] text-zinc-400 block mb-1">
                                Enter Custom Duration (e.g. "18 Months", "45 Days")
                              </label>
                              <input
                                type="text"
                                value={courseCustomDuration}
                                onChange={(e) => setCourseCustomDuration(e.target.value)}
                                placeholder="e.g. 18 Months"
                                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-zinc-400 block mb-1">
                              Start Date
                            </label>
                            <input
                              type="text"
                              value={courseStartDate}
                              onChange={(e) => setCourseStartDate(e.target.value)}
                              placeholder="e.g. 15 Jun 2026"
                              className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-zinc-400 block mb-1">
                              End Date
                            </label>
                            <input
                              type="text"
                              value={courseEndDate}
                              onChange={(e) => setCourseEndDate(e.target.value)}
                              placeholder="e.g. 31 Mar 2027"
                              className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}

                      <div className="p-2.5 bg-zinc-900/80 rounded-xl text-[11px] text-zinc-300 flex items-center justify-between">
                        <span>Duration as shown to students:</span>
                        <span className="font-bold text-amber-300">
                          {getResolvedDuration(
                            courseDurationType,
                            courseDurationOption,
                            courseCustomDuration,
                            courseStartDate,
                            courseEndDate
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Pricing & Secondary Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-zinc-400 block mb-1">Offer Price (₹) *</label>
                        <input
                          type="number"
                          value={coursePrice}
                          onChange={(e) => setCoursePrice(e.target.value)}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={courseOriginalPrice}
                          onChange={(e) => setCourseOriginalPrice(e.target.value)}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Lectures Count</label>
                        <input
                          type="number"
                          value={courseLectures}
                          onChange={(e) => setCourseLectures(e.target.value)}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white font-mono"
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

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setShowAddCourseModal(false)}
                        className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold shadow-md shadow-amber-500/20 hover:brightness-110"
                      >
                        Save & Publish Course
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* EDIT COURSE FULL MODAL */}
              {editingCourseFull && (
                <div className="p-5 bg-[#12121c] border-2 border-amber-500/40 rounded-2xl space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">
                        Edit Course: {editingCourseFull.title}
                      </h3>
                    </div>
                    <button onClick={() => setEditingCourseFull(null)} className="text-zinc-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditedCourse} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-zinc-300 font-semibold block mb-1">Course Title</label>
                        <input
                          type="text"
                          required
                          value={editingCourseFull.title}
                          onChange={(e) => setEditingCourseFull({ ...editingCourseFull, title: e.target.value })}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-300 font-semibold block mb-1">Category</label>
                        <select
                          value={editingCourseFull.categoryId}
                          onChange={(e) => {
                            const found = categories.find((c) => c.id === e.target.value);
                            setEditingCourseFull({
                              ...editingCourseFull,
                              categoryId: e.target.value,
                              categoryName: found?.name || editingCourseFull.categoryName,
                              categoryGroup: found?.group || editingCourseFull.categoryGroup,
                            });
                          }}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name} ({cat.group})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Direct Image Replacement */}
                    <div className="p-4 bg-black/50 border border-amber-500/30 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-bold text-amber-400 block">
                            Course Thumbnail
                          </label>
                          <span className="text-[10px] text-zinc-400">
                            Replace directly from device or update image URL
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Replace from Device</span>
                        </button>
                      </div>

                      <input
                        type="file"
                        ref={editFileInputRef}
                        accept="image/*"
                        onChange={handleEditDeviceImageUpload}
                        className="hidden"
                      />

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                          <img
                            src={editingCourseFull.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 w-full space-y-1">
                          <input
                            type="text"
                            value={editingCourseFull.thumbnailUrl}
                            onChange={(e) => setEditingCourseFull({ ...editingCourseFull, thumbnailUrl: e.target.value })}
                            className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Duration Editing */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-zinc-400 block mb-1">Duration (e.g. 1 Year, 6 Months)</label>
                        <input
                          type="text"
                          value={editingCourseFull.duration || ''}
                          onChange={(e) => setEditingCourseFull({ ...editingCourseFull, duration: e.target.value })}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Price (₹)</label>
                        <input
                          type="number"
                          value={editingCourseFull.price}
                          onChange={(e) => setEditingCourseFull({ ...editingCourseFull, price: Number(e.target.value) })}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={editingCourseFull.originalPrice}
                          onChange={(e) => setEditingCourseFull({ ...editingCourseFull, originalPrice: Number(e.target.value) })}
                          className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setEditingCourseFull(null)}
                        className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 text-black font-extrabold shadow-md hover:bg-amber-400"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* DELETE CONFIRMATION MODAL */}
              {courseToDelete && (
                <div className="p-5 bg-rose-950/40 border border-rose-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Confirm Deletion of Course</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    Are you sure you want to permanently delete <strong className="text-white">"{courseToDelete.title}"</strong>? 
                    Enrolled students will lose access to modules and notes.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setCourseToDelete(null)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDeleteCourse}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                    >
                      Delete Course Permanently
                    </button>
                  </div>
                </div>
              )}

              {/* COURSES LIST */}
              <div className="space-y-3">
                {courses.map((c) => {
                  const isEditingPrice = editingCourseId === c.id;

                  return (
                    <div
                      key={c.id}
                      className="p-4 bg-[#111117] border border-zinc-800 hover:border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* SINGLE THUMBNAIL DISPLAY */}
                        <div className="w-16 h-12 rounded-xl overflow-hidden border border-amber-500/30 shrink-0 bg-black">
                          <img
                            src={c.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-amber-400 uppercase">
                              {c.categoryName || c.category}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold">
                              Duration: {c.duration || '1 Year'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white truncate mt-0.5">{c.title}</h4>
                          <p className="text-[11px] text-zinc-400">
                            {c.totalLectures} Lectures · {c.totalNotes} Notes · {c.modules.length} Modules
                          </p>
                        </div>
                      </div>

                      {/* Pricing and Action Buttons */}
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {isEditingPrice ? (
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
                          <div className="flex items-center gap-2">
                            <div className="text-right mr-2">
                              <span className="font-mono text-base font-bold text-amber-400 block">
                                ₹{c.price.toLocaleString('en-IN')}
                              </span>
                              <span className="font-mono text-[10px] text-zinc-500 line-through">
                                ₹{c.originalPrice.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setEditingCourseId(c.id);
                                setNewPrice(c.price);
                              }}
                              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-800 text-xs flex items-center gap-1"
                              title="Quick price edit"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span className="text-[11px] hidden md:inline">Price</span>
                            </button>

                            <button
                              onClick={() => setEditingCourseFull(c)}
                              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-800 text-xs flex items-center gap-1"
                              title="Edit full course"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="text-[11px] hidden md:inline">Edit</span>
                            </button>

                            <button
                              onClick={() => setCourseToDelete(c)}
                              className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-zinc-800 text-xs"
                              title="Delete course"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ADMISSIONS & PAYMENT HISTORY (New Dedicated Admin Section) */}
          {activeAdminTab === 'admissions' && (
            <div className="space-y-5 max-w-5xl">
              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Student Admissions & Payment History
                </h2>
                <p className="text-xs text-zinc-400">
                  Real-time admissions ledger verified via Razorpay HMAC signature authentication and secure backend records.
                </p>
              </div>

              {/* Revenue & Admissions Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-[#111117] border border-amber-500/30 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Revenue</span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400 mt-1 tabular-nums">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>Verified Admissions</span>
                  </span>
                </div>

                <div className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Confirmed Admissions</span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-1 tabular-nums">
                    {totalVerifiedAdmissions}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 block">Active Enrollment</span>
                </div>

                <div className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Payment Gateway</span>
                  <div className="text-base font-mono font-bold text-cyan-400 mt-1">
                    Razorpay + UPI
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 block">HMAC SHA256 Active</span>
                </div>

                <div className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Average Order Value</span>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-purple-400 mt-1 tabular-nums">
                    ₹{totalVerifiedAdmissions > 0 ? Math.round(totalRevenue / totalVerifiedAdmissions).toLocaleString('en-IN') : '0'}
                  </div>
                  <span className="text-[10px] text-purple-400 mt-1 block">Per Student</span>
                </div>
              </div>

              {/* Filter Search Bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={admissionsSearch}
                    onChange={(e) => setAdmissionsSearch(e.target.value)}
                    placeholder="Search by student name, course, receipt number, or order ID..."
                    className="w-full bg-black border border-zinc-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Transactions Table */}
              <div className="p-4 bg-[#111117] border border-zinc-800 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-[11px] font-semibold">
                      <th className="pb-3 pl-2">Receipt & Order ID</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Enrolled Course</th>
                      <th className="pb-3">Method</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 pr-2 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-xs text-zinc-500">
                          No matching payment records found.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((t) => (
                        <tr key={t.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-3 pl-2">
                            <span className="font-mono font-bold text-amber-300 block">{t.receiptNumber}</span>
                            <span className="font-mono text-[10px] text-zinc-500">{t.orderId}</span>
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-white">{t.studentName}</div>
                            <div className="text-[10px] text-zinc-500">{t.studentEmail}</div>
                          </td>
                          <td className="py-3 text-zinc-200">
                            <span className="font-semibold block truncate max-w-[180px]">{t.courseTitle}</span>
                            <span className="text-[10px] text-amber-400">{t.categoryName}</span>
                          </td>
                          <td className="py-3 font-mono text-zinc-300 uppercase text-[11px]">
                            {t.paymentMethod}
                          </td>
                          <td className="py-3 font-mono font-bold text-amber-400">
                            ₹{t.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 text-zinc-400 text-[11px]">
                            {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.status === 'success'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {t.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 pr-2 text-right">
                            <button
                              onClick={() => openPdfViewer({
                                title: `Official Admission Receipt - ${t.receiptNumber}`,
                                courseName: `${t.courseTitle} (${t.categoryName})`,
                                pages: 1,
                              })}
                              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 border border-zinc-800 text-[11px] font-semibold"
                            >
                              Receipt
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FESTIVALS & ANNOUNCEMENTS */}
          {activeAdminTab === 'announcements' && <AnnouncementsManagementView />}

          {/* TAB 5: OVERVIEW DASHBOARD */}
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
                    onClick={() => setActiveAdminTab('courses')}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
                  >
                    Add / Edit Courses
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('admissions')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors"
                  >
                    View Admissions & Payments
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('live')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors"
                  >
                    Schedule Live Class
                  </button>
                  <button
                    onClick={() => setActiveAdminTab('doubts')}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors"
                  >
                    Review Student Doubts Queue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: STUDENT MANAGEMENT */}
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

          {/* TAB 7: LIVE STREAM STUDIO */}
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

          {/* TAB 8: DOUBT RESOLUTION QUEUE */}
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

          {/* TAB 9: NOTES & STUDY PDFS ASSIGNMENT */}
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

          {/* TAB 10: TEST ZONE ADMIN */}
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

          {/* TAB 11: ALIFER AI CONFIG */}
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

          {/* TAB 12: BROADCAST PUSH NOTIFICATIONS */}
          {activeAdminTab === 'broadcast' && (
            <div className="space-y-4 max-w-xl text-xs">
              <div>
                <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <span>Broadcast Push Notification & Alerts</span>
                </h2>
                <p className="text-zinc-400">
                  Send immediate broadcasts with optional banner artwork to all enrolled students. The alert will show up live in the student notification bell and persist securely in backend storage.
                </p>
              </div>

              <form onSubmit={handleBroadcast} className="p-5 bg-[#111117] border border-zinc-800 rounded-2xl space-y-4 shadow-xl">
                {broadcastSent && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                    <div>
                      <div className="font-bold text-xs text-white">Broadcast Alert Published!</div>
                      <div className="text-[11px] text-emerald-300/90">
                        Notification {broadcastImage ? 'with attached banner ' : ''}delivered to all enrolled students and saved to backend database.
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. Alert Headline */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-300 block flex items-center justify-between">
                    <span>Alert Headline / Title <span className="text-rose-400">*</span></span>
                    <span className="text-[10px] text-zinc-500">Visible on notification banner</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="e.g. 🔴 Emergency UPSC IAS Maths Marathon Today at 7:00 PM"
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* 2. Optional Image / Banner Upload */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload Image / Add Banner</span>
                      <span className="text-[10px] font-normal text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Optional
                      </span>
                    </label>
                    <span className="text-[10px] text-zinc-500">JPG, PNG, WebP · Max 5MB</span>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={broadcastFileInputRef}
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleBroadcastImageUpload}
                    className="hidden"
                  />

                  {broadcastImageError && (
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{broadcastImageError}</span>
                    </div>
                  )}

                  {!broadcastImage ? (
                    <div
                      onClick={() => broadcastFileInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-700 hover:border-amber-500/60 rounded-xl p-4 text-center cursor-pointer bg-zinc-950/60 hover:bg-zinc-900/40 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-zinc-900 group-hover:bg-amber-500/10 border border-zinc-800 group-hover:border-amber-500/30 flex items-center justify-center mx-auto mb-2 text-zinc-400 group-hover:text-amber-400 transition-colors">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-semibold text-zinc-200 group-hover:text-amber-300 transition-colors">
                        Choose Image from Laptop
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Click to browse local files (JPG, JPEG, PNG, or WebP)
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-950 rounded-xl border border-amber-500/30 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-800 shrink-0 bg-black relative group">
                          <img
                            src={broadcastImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <div className="font-semibold text-white truncate">
                            {broadcastImageName || 'Attached Banner Image'}
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            {broadcastImageSize || 'Ready to deliver'} · Base64 Stored
                          </div>
                          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Validated & Ready</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 border-t border-zinc-900">
                        <button
                          type="button"
                          onClick={() => broadcastFileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] font-semibold border border-zinc-800 hover:border-zinc-700 flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 text-amber-400" />
                          <span>Replace Image</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveBroadcastImage}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/30 hover:bg-rose-950/50 text-rose-300 text-[11px] font-semibold border border-rose-500/30 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-rose-400" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Message Body */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-300 block flex items-center justify-between">
                    <span>Message Body <span className="text-rose-400">*</span></span>
                    <span className="text-[10px] text-zinc-500">Full announcement content</span>
                  </label>
                  <textarea
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={4}
                    placeholder="Provide full details, syllabus instructions, or session links for all students..."
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* 4. Submit Broadcast Button */}
                <button
                  type="submit"
                  disabled={!broadcastTitle.trim() || !broadcastMessage.trim() || isBroadcasting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 disabled:opacity-40 text-black font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isBroadcasting
                      ? 'Publishing Broadcast Alert...'
                      : broadcastImage
                      ? 'Send Broadcast Alert (With Banner)'
                      : 'Send Text Broadcast Alert'}
                  </span>
                </button>

                <p className="text-[11px] text-zinc-500 text-center">
                  Broadcasts appear instantly on student notification bells and are permanently archived in student notification history.
                </p>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
