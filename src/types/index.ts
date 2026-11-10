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

export type CategoryGroup = 
  | 'Competitive Examinations' 
  | 'Higher Education' 
  | 'School Foundation' 
  | 'Skill & Career';

export interface CourseCategory {
  id: string; // e.g. 'cat-upsc-ias-maths', 'cat-gate-ies', 'cat-12th-foundation'
  name: string;
  group: CategoryGroup;
  description: string;
  thumbnailUrl: string;
  order: number;
  isActive: boolean;
  badge?: string;
  courseCount?: number;
}

export type CourseDurationOption = '3 Months' | '6 Months' | '1 Year' | '2 Years' | 'Custom';
export type DurationType = 'duration' | 'period';

export interface Course {
  id: string;
  title: string;
  categoryId: string; // Foreign key referencing CourseCategory.id
  categoryName?: string;
  categoryGroup?: CategoryGroup;
  category: string; // Backward compatibility with string
  isPublished?: boolean; // Default true; unpublished courses hidden from students
  isActive?: boolean;
  instructor: {
    name: string;
    title: string;
    avatarUrl: string;
    experience: string;
    bio: string;
  };
  thumbnailUrl: string; // STRICT: ONE COURSE = ONE THUMBNAIL
  bannerUrl?: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;

  // Actual Course Duration (Required: Option A = duration or Option B = period)
  duration: string; // e.g. "1 Year", "6 Months", "3 Months", "2 Years", or "15 Jun 2026 - 31 Mar 2027"
  durationType?: DurationType; // 'duration' | 'period'
  startDate?: string;
  endDate?: string;

  // Secondary informational details (not duration)
  durationHours?: number;
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
  imageUrl?: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  imageUrl?: string;
  subject?: string;
}

export interface ThumbnailAsset {
  id: string;
  title: string;
  categoryTag: string; // e.g. 'Mathematics', 'UPSC', 'Physics', 'Foundation', 'General'
  url: string;
  uploadedAt: string;
  usedInCoursesCount?: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  bannerUrl?: string;
  type: 'festival' | 'course_launch' | 'exam_alert' | 'general';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  targetAudience: 'all' | 'competitive' | 'foundation' | 'higher_education';
  popupDisplay: 'once' | 'repeated'; // show once or repeatedly on app launch
  isActive: boolean;
  ctaText?: string;
  ctaLink?: string;
  createdAt: string;
}

export interface SocialLinkItem {
  id: string;
  platform: 'whatsapp' | 'telegram' | 'youtube' | 'instagram' | 'facebook' | 'website' | 'email';
  name: string;
  description: string;
  url: string;
  isPrimary?: boolean;
  verified: boolean;
}

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';
export type PaymentMethodType = 'razorpay' | 'upi' | 'card' | 'netbanking' | 'sandbox_test';

export interface PaymentTransaction {
  id: string; // Internal transaction ID
  orderId: string; // Razorpay order_... or internal order ID
  paymentId?: string; // Razorpay payment ID (pay_...)
  signature?: string;
  courseId: string;
  courseTitle: string;
  categoryName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  amount: number; // in INR
  originalAmount: number;
  discountAmount: number;
  currency: string; // 'INR'
  status: PaymentStatus;
  paymentMethod: PaymentMethodType;
  receiptNumber: string;
  createdAt: string; // ISO date string
  verifiedAt?: string;
  notes?: string;
}


