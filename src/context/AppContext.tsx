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
  LectureResource
} from '../types';
import { 
  INITIAL_STUDENT_PROFILE, 
  COURSES_DATA, 
  LIVE_CLASSES_DATA, 
  PRACTICE_TESTS_DATA, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_DOWNLOADS 
} from '../data/mockData';

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
  
  // Admin Actions
  updateCoursePrice: (courseId: string, newPrice: number) => void;
  addCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  scheduleLiveClass: (newClass: LiveClass) => void;
  addLectureResource: (courseId: string, lectureId: string, resource: LectureResource) => void;
  answerDoubt: (courseId: string, lectureId: string, queryId: string, replyText: string) => void;
  broadcastNotification: (title: string, message: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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

  // Persist student profile
  useEffect(() => {
    try {
      localStorage.setItem('alifer_student_profile', JSON.stringify(student));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }, [student]);

  const updateStudent = (updates: Partial<StudentProfile>) => {
    setStudent(prev => ({ ...prev, ...updates }));
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

  const broadcastNotification = (title: string, message: string) => {
    const newNotif: NotificationItem = {
      id: `broadcast-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type: 'announcement',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
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
