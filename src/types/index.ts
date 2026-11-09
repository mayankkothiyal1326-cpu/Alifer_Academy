export type NavigationTab = 'home' | 'learning' | 'live' | 'practice' | 'profile';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type LearningGoal = 
  | 'Exam Preparation' 
  | 'Skill Development' 
  | 'Improve Knowledge' 
  | 'Career Development';

export type LearningInterest = 
  | 'Programming' 
  | 'Mathematics' 
  | 'Science' 
  | 'Electronics' 
  | 'Management' 
  | 'Other';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  enrolledDate: string;
  learningInterests: LearningInterest[];
  skillLevel: SkillLevel;
  learningGoals: LearningGoal[];
  streakDays: number;
  totalStudyMinutes: number;
  completedLecturesCount: number;
}

export interface LectureResource {
  id: string;
  title: string;
  type: 'pdf' | 'notes' | 'code' | 'assignment';
  fileSize: string;
  downloadUrl?: string;
  pages?: number;
  contentSnippet?: string;
}

export interface StudentQuery {
  id: string;
  lectureId: string;
  studentName: string;
  studentAvatar: string;
  question: string;
  imageUrl?: string;
  timestamp: string;
  status: 'pending' | 'answered';
  teacherReply?: {
    author: string;
    text: string;
    timestamp: string;
  };
  likes: number;
}

export interface Lecture {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  videoUrl: string; // Sample educational video link or interactive video simulation
  thumbnailUrl: string;
  description: string;
  order: number;
  isCompleted?: boolean;
  lastWatchedSeconds?: number;
  resources: LectureResource[];
  queries: StudentQuery[];
  timestamps?: { time: string; label: string }[];
}

export interface Chapter {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  chapters: Chapter[];
}

export interface Course {
  id: string;
  title: string;
  category: LearningInterest | 'All-in-One';
  instructor: {
    name: string;
    title: string;
    avatarUrl: string;
    experience: string;
    bio: string;
  };
  thumbnailUrl: string;
  bannerUrl: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  durationHours: number;
  totalLectures: number;
  totalNotes: number;
  totalTests: number;
  level: SkillLevel;
  language: string;
  description: string;
  features: string[];
  isEnrolled: boolean;
  progressPercent: number;
  modules: Module[];
}

export interface LiveClass {
  id: string;
  title: string;
  courseName: string;
  subject: string;
  instructorName: string;
  instructorAvatar: string;
  scheduledTime: string; // ISO string or human string
  status: 'upcoming' | 'live' | 'completed';
  viewerCount?: number;
  streamUrl?: string;
  recordingUrl?: string;
  handouts: LectureResource[];
}

export interface LiveChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isTeacher?: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface TestQuestion {
  id: string;
  questionText: string;
  subject: string;
  topic: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  marks: number;
  negativeMarks: number;
}

export interface PracticeTest {
  id: string;
  title: string;
  subject: string;
  category: 'Chapter-wise' | 'Unit' | 'Subject-wise' | 'Full Length Mock' | 'Daily Quiz' | 'PYQ';
  durationMinutes: number;
  totalMarks: number;
  questionsCount: number;
  negativeMarking: boolean;
  questions: TestQuestion[];
  instructions: string[];
  difficulty: SkillLevel;
}

export interface TestAttemptResult {
  id: string;
  testId: string;
  testTitle: string;
  date: string;
  score: number;
  maxScore: number;
  totalQuestions: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  unattemptedCount: number;
  accuracyPercent: number;
  timeSpentSeconds: number;
  userAnswers: Record<string, string>; // questionId -> optionId
}

export interface DownloadedItem {
  id: string;
  title: string;
  courseName: string;
  type: 'pdf' | 'notes' | 'video';
  fileSize: string;
  downloadedAt: string;
  lastOpenedPage?: number;
  totalPages?: number;
  localPath: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'live' | 'test' | 'lecture' | 'announcement';
  read: boolean;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  imageUrl?: string;
  subject?: string;
}
