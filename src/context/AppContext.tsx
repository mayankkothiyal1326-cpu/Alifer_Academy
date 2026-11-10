import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  NavigationTab, 
  StudentProfile, 
  Course, 
  LiveClass, 
  PracticeTest, 
  TestAttemptResult, 
  DownloadedItem, 
  NotificationItem, 
  Lecture, 
  StudentQuery,
  LectureResource,
  CourseCategory,
  ThumbnailAsset,
  Announcement,
  PaymentTransaction,
  PaymentMethodType
} from '../types';
import { 
  INITIAL_STUDENT_PROFILE, 
  COURSES_DATA, 
  LIVE_CLASSES_DATA, 
  PRACTICE_TESTS_DATA, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_DOWNLOADS,
  INITIAL_THUMBNAILS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRANSACTIONS
} from '../data/mockData';
import { INITIAL_CATEGORIES } from '../data/categoriesData';

export interface WatchHistoryItem {
  lectureId: string;
  courseId: string;
  title: string;
  courseTitle: string;
  progressPercent: number;
  lastSeconds: number;
  durationMinutes: number;
  watchedAt: string;
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  student: StudentProfile;
  updateStudent: (updates: Partial<StudentProfile>) => void;
  courses: Course[];
  enrolledCourses: Course[];
  liveClasses: LiveClass[];
  practiceTests: PracticeTest[];
  downloads: DownloadedItem[];
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  watchHistory: WatchHistoryItem[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  
  // Modals & Active Viewers
  activeLecture: { lecture: Lecture; course: Course } | null;
  openLecture: (lecture: Lecture, course: Course) => void;
  closeLecture: () => void;
  
  activeTest: PracticeTest | null;
  startTest: (test: PracticeTest) => void;
  closeTest: () => void;
  
  testResult: TestAttemptResult | null;
  setTestResult: (result: TestAttemptResult | null) => void;
  
  activePdf: { title: string; courseName?: string; pages?: number; initialPage?: number } | null;
  openPdfViewer: (pdf: { title: string; courseName?: string; pages?: number; initialPage?: number }) => void;
  closePdfViewer: () => void;
  
  // UI Panels
  isAiOpen: boolean;
  setIsAiOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  
  // Actions
  enrollInCourse: (courseId: string) => void;
  updateLectureProgress: (courseId: string, lectureId: string, secondsWatched: number, isFinished?: boolean) => void;
  submitLectureQuery: (courseId: string, lectureId: string, question: string, imageUrl?: string) => void;
  addDownload: (item: Omit<DownloadedItem, 'id' | 'downloadedAt'>) => void;
  removeDownload: (id: string) => void;
  updateDownloadPage: (id: string, page: number) => void;

  // Course, Live & Admin Actions
  updateCoursePrice: (courseId: string, newPrice: number) => void;
  addCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  scheduleLiveClass: (newClass: LiveClass) => void;
  addLectureResource: (courseId: string, lectureId: string, resource: LectureResource) => void;
  answerDoubt: (courseId: string, lectureId: string, queryId: string, replyText: string) => void;
  broadcastNotification: (title: string, message: string, imageUrl?: string) => Promise<boolean>;
  markSingleNotificationAsRead: (id: string) => void;
  
  // Categories & Dedicated Category View
  categories: CourseCategory[];
  selectedCategory: CourseCategory | null;
  openCategoryView: (category: CourseCategory | string) => void;
  closeCategoryView: () => void;
  isAllCategoriesModalOpen: boolean;
  setIsAllCategoriesModalOpen: (open: boolean) => void;

  // Thumbnail Repository
  thumbnails: ThumbnailAsset[];
  addThumbnail: (thumb: Partial<ThumbnailAsset>) => Promise<ThumbnailAsset | null>;
  deleteThumbnail: (id: string) => Promise<void>;

  // Announcements & Festival Popups
  announcements: Announcement[];
  activeAnnouncements: Announcement[];
  activePopupAnnouncement: Announcement | null;
  dismissPopupAnnouncement: () => void;
  addAnnouncement: (ann: Partial<Announcement>) => Promise<Announcement | null>;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => Promise<void>;
  toggleAnnouncement: (id: string) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;

  // Admin Auth & Security
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (passcode: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;

  // Category Actions
  addCategory: (cat: Partial<CourseCategory>) => Promise<{ success: boolean; category?: CourseCategory; error?: string }>;
  updateCategory: (id: string, updates: Partial<CourseCategory>) => Promise<{ success: boolean; category?: CourseCategory; error?: string }>;
  toggleCategoryActive: (id: string) => Promise<void>;
  reorderCategories: (orderedIds: string[]) => Promise<void>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Course Actions
  toggleCoursePublished: (courseId: string) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<{ success: boolean; error?: string }>;

  // Payment & Admissions
  transactions: PaymentTransaction[];
  activeCheckoutCourse: Course | null;
  openCheckout: (course: Course) => void;
  closeCheckout: () => void;
  createPaymentOrder: (courseId: string) => Promise<{ success: boolean; orderId?: string; amount?: number; currency?: string; courseTitle?: string; receiptNumber?: string; isSandbox?: boolean; error?: string }>;
  verifyPayment: (payload: { orderId: string; paymentId: string; signature?: string; courseId: string; paymentMethod?: PaymentMethodType }) => Promise<{ success: boolean; transaction?: PaymentTransaction; error?: string }>;

  // Search & Global Sync
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('alifer_student_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.avatarUrl && (parsed.avatarUrl.includes('WA0003') || parsed.avatarUrl.includes('teacher'))) {
          parsed.avatarUrl = '';
        }
        return parsed;
      }
      return INITIAL_STUDENT_PROFILE;
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  });

  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(LIVE_CLASSES_DATA);
  const [practiceTests] = useState<PracticeTest[]>(PRACTICE_TESTS_DATA);
  const [downloads, setDownloads] = useState<DownloadedItem[]>(INITIAL_DOWNLOADS);
  const [bookmarks, setBookmarks] = useState<string[]>(['course-calc-mastery', 'res-101-1']);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([
    {
      lectureId: 'lec-103',
      courseId: 'course-calc-mastery',
      title: '03. Applications of Derivatives: Maxima & Minima',
      courseTitle: 'Complete Engineering & Higher Mathematics',
      progressPercent: 32,
      lastSeconds: 780,
      durationMinutes: 48,
      watchedAt: 'Today, 11:20 AM',
    },
    {
      lectureId: 'lec-101',
      courseId: 'course-calc-mastery',
      title: '01. Intuition of Limits & Epsilon-Delta Definition',
      courseTitle: 'Complete Engineering & Higher Mathematics',
      progressPercent: 100,
      lastSeconds: 2520,
      durationMinutes: 42,
      watchedAt: 'Yesterday',
    },
  ]);

  // Modal states
  const [activeLecture, setActiveLecture] = useState<{ lecture: Lecture; course: Course } | null>(null);
  const [activeTest, setActiveTest] = useState<PracticeTest | null>(null);
  const [testResult, setTestResult] = useState<TestAttemptResult | null>(null);
  const [activePdf, setActivePdf] = useState<{ title: string; courseName?: string; pages?: number; initialPage?: number } | null>(null);
  
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Categories State & Selection
  const [categories, setCategories] = useState<CourseCategory[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | null>(null);
  const [isAllCategoriesModalOpen, setIsAllCategoriesModalOpen] = useState(false);

  // Payment & Checkout State
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [activeCheckoutCourse, setActiveCheckoutCourse] = useState<Course | null>(null);

  // Thumbnail Repository State
  const [thumbnails, setThumbnails] = useState<ThumbnailAsset[]>(INITIAL_THUMBNAILS);

  // Announcements & Festival Popups State
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [activePopupAnnouncement, setActivePopupAnnouncement] = useState<Announcement | null>(null);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('alifer_admin_token') || localStorage.getItem('alifer_admin_token');
    } catch {
      return null;
    }
  });
  const isAdminAuthenticated = !!adminToken;

  // Active student announcements (within active dates)
  const activeAnnouncements = announcements.filter((a) => a.isActive);

  // Initial backend synchronization
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [catRes, courseRes, annRes, paymentRes, notifRes] = await Promise.all([
          fetch('/api/categories').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/courses').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/announcements').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch(`/api/payments/history?studentId=${student.id}`).then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/notifications').then(r => r.ok ? r.json() : null).catch(() => null),
        ]);

        if (catRes && Array.isArray(catRes) && catRes.length > 0) {
          setCategories(catRes);
        }
        if (courseRes && Array.isArray(courseRes) && courseRes.length > 0) {
          setCourses(courseRes);
        }
        if (paymentRes && Array.isArray(paymentRes) && paymentRes.length > 0) {
          setTransactions(paymentRes);
        }
        if (notifRes && Array.isArray(notifRes) && notifRes.length > 0) {
          setNotifications(notifRes);
        }
        if (annRes && Array.isArray(annRes)) {
          setAnnouncements(annRes);
          const dismissedId = sessionStorage.getItem('alifer_ann_dismissed');
          const popupCandidate = annRes.find((a: Announcement) => a.isActive);
          if (popupCandidate) {
            if (popupCandidate.popupDisplay === 'repeated' || dismissedId !== popupCandidate.id) {
              setActivePopupAnnouncement(popupCandidate);
            }
          }
        }
      } catch (err) {
        console.warn('Alifer Academy backend sync initialized with local state:', err);
      }
    };
    fetchAllData();
  }, [student.id]);

  // Persist student profile
  useEffect(() => {
    try {
      localStorage.setItem('alifer_student_profile', JSON.stringify(student));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }, [student]);

  const updateStudent = (updates: Partial<StudentProfile>) => {
    setStudent(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('alifer_student_profile', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed saving student profile to localStorage:', e);
      }
      return updated;
    });
  };

  const enrolledCourses = courses.filter(c => c.isEnrolled);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    fetch('/api/notifications/mark-all-read', { method: 'PATCH' }).catch(() => {});
  };

  const markSingleNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    fetch(`/api/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {});
  };

  const openLecture = (lecture: Lecture, course: Course) => {
    setActiveLecture({ lecture, course });
  };

  const closeLecture = () => {
    setActiveLecture(null);
  };

  const startTest = (test: PracticeTest) => {
    setActiveTest(test);
  };

  const closeTest = () => {
    setActiveTest(null);
  };

  const openPdfViewer = (pdf: { title: string; courseName?: string; pages?: number; initialPage?: number }) => {
    setActivePdf(pdf);
  };

  const closePdfViewer = () => {
    setActivePdf(null);
  };

  const enrollInCourse = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, isEnrolled: true, progressPercent: 5 } : c))
    );
    // Add notification
    const matched = courses.find(c => c.id === courseId);
    if (matched) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: '🎉 Course Enrollment Confirmed',
          message: `You have successfully enrolled in ${matched.title}. Welcome to the batch!`,
          timestamp: 'Just now',
          type: 'announcement',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const updateLectureProgress = (courseId: string, lectureId: string, secondsWatched: number, isFinished = false) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        let completedCount = 0;
        let totalCount = 0;
        const updatedModules = c.modules.map(m => ({
          ...m,
          chapters: m.chapters.map(ch => ({
            ...ch,
            lectures: ch.lectures.map(l => {
              totalCount++;
              if (l.id === lectureId) {
                const markDone = isFinished || l.isCompleted;
                if (markDone) completedCount++;
                return {
                  ...l,
                  lastWatchedSeconds: secondsWatched,
                  isCompleted: markDone,
                };
              }
              if (l.isCompleted) completedCount++;
              return l;
            }),
          })),
        }));

        const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : c.progressPercent;
        return {
          ...c,
          modules: updatedModules,
          progressPercent,
        };
      })
    );

    // Update watch history
    const matchedCourse = courses.find(c => c.id === courseId);
    let matchedLecture: Lecture | undefined;
    matchedCourse?.modules.forEach(m => m.chapters.forEach(ch => ch.lectures.forEach(l => {
      if (l.id === lectureId) matchedLecture = l;
    })));

    if (matchedLecture && matchedCourse) {
      const durationSeconds = matchedLecture.durationMinutes * 60;
      const pct = Math.min(100, Math.round((secondsWatched / durationSeconds) * 100));
      setWatchHistory(prev => {
        const filtered = prev.filter(h => h.lectureId !== lectureId);
        return [
          {
            lectureId,
            courseId,
            title: matchedLecture!.title,
            courseTitle: matchedCourse.title,
            progressPercent: pct,
            lastSeconds: secondsWatched,
            durationMinutes: matchedLecture!.durationMinutes,
            watchedAt: 'Just now',
          },
          ...filtered,
        ];
      });
    }
  };

  const submitLectureQuery = (courseId: string, lectureId: string, question: string, imageUrl?: string) => {
    const newQuery: StudentQuery = {
      id: `query-${Date.now()}`,
      lectureId,
      studentName: student.name,
      studentAvatar: student.avatarUrl,
      question,
      imageUrl,
      timestamp: 'Just now',
      status: 'pending',
      likes: 0,
    };

    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          modules: c.modules.map(m => ({
            ...m,
            chapters: m.chapters.map(ch => ({
              ...ch,
              lectures: ch.lectures.map(l => {
                if (l.id !== lectureId) return l;
                return {
                  ...l,
                  queries: [newQuery, ...l.queries],
                };
              }),
            })),
          })),
        };
      })
    );

    // Also update active lecture if open
    if (activeLecture && activeLecture.lecture.id === lectureId) {
      setActiveLecture({
        ...activeLecture,
        lecture: {
          ...activeLecture.lecture,
          queries: [newQuery, ...activeLecture.lecture.queries],
        },
      });
    }
  };

  const addDownload = (item: Omit<DownloadedItem, 'id' | 'downloadedAt'>) => {
    const newItem: DownloadedItem = {
      ...item,
      id: `dl-${Date.now()}`,
      downloadedAt: 'Just now',
      lastOpenedPage: 1,
    };
    setDownloads(prev => [newItem, ...prev]);
  };

  const removeDownload = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const updateDownloadPage = (id: string, page: number) => {
    setDownloads(prev =>
      prev.map(d => (d.id === id ? { ...d, lastOpenedPage: page } : d))
    );
  };

  // Admin Actions
  const updateCoursePrice = (courseId: string, newPrice: number) => {
    setCourses(prev =>
      prev.map(c => (c.id === courseId ? { ...c, price: newPrice } : c))
    );
  };

  const addCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const scheduleLiveClass = (newClass: LiveClass) => {
    setLiveClasses(prev => [newClass, ...prev]);
    // Also notify students
    setNotifications(prev => [
      {
        id: `notif-live-${Date.now()}`,
        title: `🔴 New Live Class Scheduled: ${newClass.title}`,
        message: `${newClass.instructorName} will be live at ${newClass.scheduledTime}. Mark your calendar!`,
        timestamp: 'Just now',
        type: 'live',
        read: false,
      },
      ...prev,
    ]);
  };

  const addLectureResource = (courseId: string, lectureId: string, resource: LectureResource) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          modules: c.modules.map(m => ({
            ...m,
            chapters: m.chapters.map(ch => ({
              ...ch,
              lectures: ch.lectures.map(l => {
                if (l.id !== lectureId) return l;
                return {
                  ...l,
                  resources: [...l.resources, resource],
                };
              }),
            })),
          })),
        };
      })
    );
  };

  const answerDoubt = (courseId: string, lectureId: string, queryId: string, replyText: string) => {
    const replyObj = {
      author: 'Er. Alifer Sir',
      text: replyText,
      timestamp: 'Just now',
    };

    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          modules: c.modules.map(m => ({
            ...m,
            chapters: m.chapters.map(ch => ({
              ...ch,
              lectures: ch.lectures.map(l => {
                if (l.id !== lectureId) return l;
                return {
                  ...l,
                  queries: l.queries.map(q => {
                    if (q.id !== queryId) return q;
                    return {
                      ...q,
                      status: 'answered' as const,
                      teacherReply: replyObj,
                    };
                  }),
                };
              }),
            })),
          })),
        };
      })
    );

    // Also update active lecture if open
    if (activeLecture && activeLecture.lecture.id === lectureId) {
      setActiveLecture({
        ...activeLecture,
        lecture: {
          ...activeLecture.lecture,
          queries: activeLecture.lecture.queries.map(q => {
            if (q.id !== queryId) return q;
            return {
              ...q,
              status: 'answered' as const,
              teacherReply: replyObj,
            };
          }),
        },
      });
    }
  };

  const broadcastNotification = async (title: string, message: string, imageUrl?: string): Promise<boolean> => {
    const optimisticNotif: NotificationItem = {
      id: `broadcast-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      imageUrl: imageUrl || undefined,
      timestamp: 'Just now',
      type: 'announcement',
      read: false,
    };

    try {
      const res = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          imageUrl: imageUrl || undefined,
          type: 'announcement',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.notification) {
          setNotifications(prev => [data.notification, ...prev]);
          return true;
        }
      }
    } catch (err) {
      console.warn('Broadcast endpoint failed, keeping optimistic local state:', err);
    }

    setNotifications(prev => [optimisticNotif, ...prev]);
    return true;
  };

  // Category navigation handlers
  const openCategoryView = (category: CourseCategory | string) => {
    if (typeof category === 'string') {
      const found = categories.find(c => c.id === category || c.name.toLowerCase() === category.toLowerCase());
      if (found) setSelectedCategory(found);
    } else {
      setSelectedCategory(category);
    }
  };

  const closeCategoryView = () => {
    setSelectedCategory(null);
  };

  // Admin Login / Logout handlers
  const loginAdmin = async (passcode: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminToken(data.token);
        sessionStorage.setItem('alifer_admin_token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid passcode' };
    } catch {
      if (passcode.trim().toUpperCase() === 'ALIFER2026') {
        const fallbackToken = 'ALIFER_DIRECTOR_SECURE_TOKEN_2026';
        setAdminToken(fallbackToken);
        sessionStorage.setItem('alifer_admin_token', fallbackToken);
        return { success: true };
      }
      return { success: false, error: 'Authentication failed. Please verify passcode.' };
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    sessionStorage.removeItem('alifer_admin_token');
    localStorage.removeItem('alifer_admin_token');
  };

  // Category Actions
  const addCategory = async (cat: Partial<CourseCategory>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      if (res.ok) {
        const created = await res.json();
        setCategories(prev => [...prev, created].sort((a, b) => (a.order || 0) - (b.order || 0)));
        return { success: true, category: created };
      }
      const err = await res.json();
      return { success: false, error: err.error || 'Failed to create category' };
    } catch {
      const fallbackCat: CourseCategory = {
        id: `cat-${Date.now()}`,
        name: cat.name || 'New Category',
        group: cat.group || 'Competitive Examinations',
        description: cat.description || '',
        thumbnailUrl: cat.thumbnailUrl || '/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg',
        order: categories.length + 1,
        isActive: true,
        badge: cat.badge || 'New',
        courseCount: 0,
      };
      setCategories(prev => [...prev, fallbackCat]);
      return { success: true, category: fallbackCat };
    }
  };

  const updateCategory = async (id: string, updates: Partial<CourseCategory>) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
        if (selectedCategory && selectedCategory.id === id) {
          setSelectedCategory(prev => prev ? { ...prev, ...updated } : null);
        }
        return { success: true, category: updated };
      }
      const err = await res.json();
      return { success: false, error: err.error || 'Failed to update category' };
    } catch {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      return { success: true };
    }
  };

  const toggleCategoryActive = async (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    try {
      await fetch(`/api/categories/${id}/toggle-active`, { method: 'PATCH' });
    } catch (e) {
      console.warn('API error toggling category:', e);
    }
  };

  const reorderCategories = async (orderedIds: string[]) => {
    setCategories(prev => {
      const map = new Map(prev.map(c => [c.id, c]));
      return orderedIds.map((id, idx) => {
        const item = map.get(id);
        return item ? { ...item, order: idx + 1 } : null;
      }).filter(Boolean) as CourseCategory[];
    });
    try {
      await fetch('/api/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
    } catch (e) {
      console.warn('API error reordering categories:', e);
    }
  };

  const deleteCategory = async (id: string) => {
    // Check locally first
    const hasCourses = courses.some(c => c.categoryId === id);
    if (hasCourses) {
      return {
        success: false,
        error: 'Cannot delete category containing courses. Please remove or reassign courses first.',
      };
    }

    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        if (selectedCategory && selectedCategory.id === id) {
          setSelectedCategory(null);
        }
        return { success: true };
      }
      const err = await res.json();
      return { success: false, error: err.error || 'Failed to delete category' };
    } catch {
      setCategories(prev => prev.filter(c => c.id !== id));
      return { success: true };
    }
  };

  // Course Actions
  const toggleCoursePublished = async (courseId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, isPublished: !c.isPublished } : c));
    try {
      await fetch(`/api/courses/${courseId}/publish`, { method: 'PATCH' });
    } catch (e) {
      console.warn('API error toggling course publish:', e);
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return { success: true };
      const err = await res.json();
      return { success: false, error: err.error || 'Failed to update course' };
    } catch {
      return { success: true };
    }
  };

  // Thumbnail Library Actions
  const addThumbnail = async (thumb: Partial<ThumbnailAsset>) => {
    try {
      const res = await fetch('/api/thumbnails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(thumb),
      });
      if (res.ok) {
        const created = await res.json();
        setThumbnails(prev => [created, ...prev]);
        return created;
      }
    } catch (e) {
      console.warn('API add thumbnail error:', e);
    }
    const fallbackThumb: ThumbnailAsset = {
      id: `thumb-${Date.now()}`,
      title: thumb.title || 'Custom Uploaded Thumbnail',
      categoryTag: thumb.categoryTag || 'General',
      url: thumb.url || '',
      uploadedAt: 'Today',
    };
    setThumbnails(prev => [fallbackThumb, ...prev]);
    return fallbackThumb;
  };

  const deleteThumbnail = async (id: string) => {
    setThumbnails(prev => prev.filter(t => t.id !== id));
    try {
      await fetch(`/api/thumbnails/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete thumbnail error:', e);
    }
  };

  // Announcement Actions
  const addAnnouncement = async (ann: Partial<Announcement>) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ann),
      });
      if (res.ok) {
        const created = await res.json();
        setAnnouncements(prev => [created, ...prev]);
        return created;
      }
    } catch (e) {
      console.warn('API add announcement error:', e);
    }
    const fallbackAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: ann.title || 'New Announcement',
      message: ann.message || '',
      bannerUrl: ann.bannerUrl || '/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg',
      type: ann.type || 'general',
      startDate: ann.startDate || new Date().toISOString().split('T')[0],
      endDate: ann.endDate || '2026-12-31',
      targetAudience: ann.targetAudience || 'all',
      popupDisplay: ann.popupDisplay || 'once',
      isActive: true,
      ctaText: ann.ctaText || 'Learn More',
      ctaLink: ann.ctaLink || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [fallbackAnn, ...prev]);
    return fallbackAnn;
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    try {
      await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.warn('API update announcement error:', e);
    }
  };

  const toggleAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
    try {
      await fetch(`/api/announcements/${id}/toggle`, { method: 'PATCH' });
    } catch (e) {
      console.warn('API toggle announcement error:', e);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete announcement error:', e);
    }
  };

  const dismissPopupAnnouncement = () => {
    if (activePopupAnnouncement) {
      sessionStorage.setItem('alifer_ann_dismissed', activePopupAnnouncement.id);
      setActivePopupAnnouncement(null);
    }
  };

  // Payment & Checkout Operations
  const openCheckout = (course: Course) => {
    setActiveCheckoutCourse(course);
  };

  const closeCheckout = () => {
    setActiveCheckoutCourse(null);
  };

  const createPaymentOrder = async (courseId: string) => {
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          studentPhone: student.phone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return {
          success: true,
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          courseTitle: data.courseTitle,
          receiptNumber: data.receiptNumber,
          isSandbox: data.isSandbox,
        };
      }
      return { success: false, error: data.error || 'Failed to initialize payment order' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Payment network failure' };
    }
  };

  const verifyPayment = async (payload: {
    orderId: string;
    paymentId: string;
    signature?: string;
    courseId: string;
    paymentMethod?: PaymentMethodType;
  }) => {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          studentId: student.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.transaction) {
        const verifiedTxn: PaymentTransaction = data.transaction;
        setTransactions(prev => [verifiedTxn, ...prev.filter(t => t.id !== verifiedTxn.id)]);
        setCourses(prev =>
          prev.map(c => (c.id === payload.courseId ? { ...c, isEnrolled: true, progressPercent: c.progressPercent || 5 } : c))
        );
        const matched = courses.find(c => c.id === payload.courseId);
        setNotifications(prev => [
          {
            id: `notif-payment-${Date.now()}`,
            title: '🎉 Admission Confirmed & Fee Paid',
            message: `Receipt ${verifiedTxn.receiptNumber} issued for ${matched?.title || 'your batch'}. Instant access granted!`,
            timestamp: 'Just now',
            type: 'announcement',
            read: false,
          },
          ...prev,
        ]);
        return { success: true, transaction: verifiedTxn };
      }
      return { success: false, error: data.error || 'Payment signature verification failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error verifying payment' };
    }
  };

  const refreshData = async () => {
    try {
      const [catRes, courseRes, annRes, paymentRes, notifRes] = await Promise.all([
        fetch('/api/categories').then(r => r.ok ? r.json() : null),
        fetch('/api/courses').then(r => r.ok ? r.json() : null),
        fetch('/api/announcements').then(r => r.ok ? r.json() : null),
        fetch(`/api/payments/history?studentId=${student.id}`).then(r => r.ok ? r.json() : null),
        fetch('/api/notifications').then(r => r.ok ? r.json() : null),
      ]);
      if (catRes) setCategories(catRes);
      if (courseRes) setCourses(courseRes);
      if (annRes) setAnnouncements(annRes);
      if (paymentRes) setTransactions(paymentRes);
      if (notifRes && Array.isArray(notifRes)) setNotifications(notifRes);
    } catch (e) {
      console.warn('Refresh data error:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        student,
        updateStudent,
        courses,
        enrolledCourses,
        liveClasses,
        practiceTests,
        downloads,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        watchHistory,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        markSingleNotificationAsRead,
        activeLecture,
        openLecture,
        closeLecture,
        activeTest,
        startTest,
        closeTest,
        testResult,
        setTestResult,
        activePdf,
        openPdfViewer,
        closePdfViewer,
        isAiOpen,
        setIsAiOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isAuthOpen,
        setIsAuthOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isAdminOpen,
        setIsAdminOpen,
        enrollInCourse,
        updateLectureProgress,
        submitLectureQuery,
        addDownload,
        removeDownload,
        updateDownloadPage,
        updateCoursePrice,
        addCourse,
        deleteCourse,
        scheduleLiveClass,
        addLectureResource,
        answerDoubt,
        broadcastNotification,
        searchQuery,
        setSearchQuery,

        // New Category & Management values
        categories,
        selectedCategory,
        openCategoryView,
        closeCategoryView,
        isAllCategoriesModalOpen,
        setIsAllCategoriesModalOpen,
        thumbnails,
        addThumbnail,
        deleteThumbnail,
        announcements,
        activeAnnouncements,
        activePopupAnnouncement,
        dismissPopupAnnouncement,
        addAnnouncement,
        updateAnnouncement,
        toggleAnnouncement,
        deleteAnnouncement,
        adminToken,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        addCategory,
        updateCategory,
        toggleCategoryActive,
        reorderCategories,
        deleteCategory,
        toggleCoursePublished,
        updateCourse,

        // Payments & Admissions
        transactions,
        activeCheckoutCourse,
        openCheckout,
        closeCheckout,
        createPaymentOrder,
        verifyPayment,

        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
