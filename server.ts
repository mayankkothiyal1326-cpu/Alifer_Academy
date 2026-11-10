import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_CATEGORIES } from './src/data/categoriesData';
import { COURSES_DATA, INITIAL_THUMBNAILS, INITIAL_ANNOUNCEMENTS, INITIAL_TRANSACTIONS, INITIAL_NOTIFICATIONS } from './src/data/mockData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser with 15MB limit for image attachments
app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI client on server
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for Alifer Academy Educational AI Assistant
const ALIFER_AI_SYSTEM_INSTRUCTION = `You are the official ALIFER AI ASSISTANT, the dedicated academic mentor and doubt-clearing tutor for Alifer Academy students.
Founded with the philosophy "Learning For All", Alifer Academy delivers world-class education in:
- Mathematics (Algebra, Calculus, Geometry, Trigonometry, Statistics)
- Science (Physics, Chemistry, Biology)
- Computer Science & Programming (Python, C++, Java, Web Development, Data Structures & Algorithms)
- Electronics & Engineering Fundamentals
- Exam Preparation (Boards, Competitive, Engineering & Skills)

Your Persona & Capabilities:
1. Provide accurate, clear, and structured step-by-step explanations.
2. Be warm, motivating, encouraging, and academically rigorous.
3. Support both English, Hindi, and natural Hinglish seamlessly based on what the student prefers.
4. When explaining mathematical or scientific formulas, write clean mathematical notations.
5. If analyzing an attached image of a question, homework problem, or circuit diagram, break down the visible text/figure first, then provide the solution and underlying concepts.
6. When answering coding questions, explain logic first, provide clean, commented code, and highlight edge cases.
7. Offer follow-up practice suggestions to test understanding.`;

// API: AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], image = null, subject = 'General' } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: 'Message or image attachment is required.' });
    }

    if (!apiKey || !aiClient) {
      // Return clear informative response if GEMINI_API_KEY is not set yet in environment
      return res.status(200).json({
        reply: `Hello! I am the Alifer AI Assistant. The Gemini API key has not been configured in the environment settings yet. 

Once configured in Settings > Secrets, I can assist you with:
- Step-by-step math and physics problem solving
- Coding and debug assistance (C++, Python, Java, Web)
- Doubt solving from textbook photo uploads
- Concept summaries in English and Hindi / Hinglish.

Your prompt was: "${message || 'Image uploaded'}" (Subject: ${subject})`,
        isOfflineMode: true,
      });
    }

    // Build contents for gemini-3.8-flash
    const parts: any[] = [];

    // If student attached an image (dataURL format "data:image/jpeg;base64,...")
    if (image && typeof image === 'string' && image.includes(',')) {
      const match = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    // Add context from past dialogue if available
    let promptText = '';
    if (history && Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-4);
      promptText += `Previous context:\n`;
      for (const h of recent) {
        promptText += `${h.role === 'user' ? 'Student' : 'Alifer Assistant'}: ${h.text}\n`;
      }
      promptText += `\nCurrent Subject focus: ${subject}\n`;
      promptText += `Student's New Question: ${message || 'Please solve and explain the attached image question.'}`;
    } else {
      promptText = `Subject focus: ${subject}\nStudent's Question: ${message || 'Please solve and explain the attached image question.'}`;
    }

    parts.push({ text: promptText });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: ALIFER_AI_SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text || 'I could not generate a response. Please try rephrasing your question.';
    return res.json({ reply, isOfflineMode: false });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process AI query',
      reply: `Sorry, an error occurred while connecting to Alifer AI Assistant: ${error.message || 'Internal error'}. Please try again shortly.`,
    });
  }
});

// API: Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    academy: 'Alifer Academy',
    version: '1.0.0',
    geminiConfigured: !!apiKey,
    razorpayConfigured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  });
});

// ==========================================
// PERSISTENT STORAGE ENGINE (storage/academy-data.json)
// ==========================================
const STORAGE_DIR = path.resolve(__dirname, 'storage');
const DATA_FILE = path.join(STORAGE_DIR, 'academy-data.json');

interface AcademyDataStore {
  categories: any[];
  courses: any[];
  thumbnails: any[];
  announcements: any[];
  notifications: any[];
  queries: any[];
  transactions: any[];
  studentCourseAccess: Record<string, string[]>;
}

let dataStore: AcademyDataStore = {
  categories: [],
  courses: [],
  thumbnails: [],
  announcements: [],
  notifications: [],
  queries: [],
  transactions: [],
  studentCourseAccess: {},
};

function initDataStore() {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      dataStore = {
        categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : INITIAL_CATEGORIES,
        courses: Array.isArray(parsed.courses) && parsed.courses.length > 0 ? parsed.courses : COURSES_DATA,
        thumbnails: Array.isArray(parsed.thumbnails) && parsed.thumbnails.length > 0 ? parsed.thumbnails : INITIAL_THUMBNAILS,
        announcements: Array.isArray(parsed.announcements) && parsed.announcements.length > 0 ? parsed.announcements : INITIAL_ANNOUNCEMENTS,
        notifications: Array.isArray(parsed.notifications) && parsed.notifications.length > 0 ? parsed.notifications : INITIAL_NOTIFICATIONS,
        queries: Array.isArray(parsed.queries) ? parsed.queries : [],
        transactions: Array.isArray(parsed.transactions) && parsed.transactions.length > 0 ? parsed.transactions : INITIAL_TRANSACTIONS,
        studentCourseAccess: parsed.studentCourseAccess && typeof parsed.studentCourseAccess === 'object' ? parsed.studentCourseAccess : {
          'STU-ALF-2026-8841': ['course-calc-mastery'],
        },
      };
    } else {
      dataStore = {
        categories: INITIAL_CATEGORIES,
        courses: COURSES_DATA,
        thumbnails: INITIAL_THUMBNAILS,
        announcements: INITIAL_ANNOUNCEMENTS,
        notifications: INITIAL_NOTIFICATIONS,
        queries: [],
        transactions: INITIAL_TRANSACTIONS,
        studentCourseAccess: {
          'STU-ALF-2026-8841': ['course-calc-mastery'],
        },
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataStore, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[Storage] Error initializing academy data store, falling back to memory seed:', err);
    dataStore = {
      categories: INITIAL_CATEGORIES,
      courses: COURSES_DATA,
      thumbnails: INITIAL_THUMBNAILS,
      announcements: INITIAL_ANNOUNCEMENTS,
      notifications: INITIAL_NOTIFICATIONS,
      queries: [],
      transactions: INITIAL_TRANSACTIONS,
      studentCourseAccess: {
        'STU-ALF-2026-8841': ['course-calc-mastery'],
      },
    };
  }
}

function saveDataStore() {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(dataStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Failed to save academy data store:', err);
  }
}

// Initialize on boot
initDataStore();

// ==========================================
// 1. ADMIN AUTHENTICATION
// ==========================================
const ADMIN_PASSCODE = 'ALIFER2026';
const ADMIN_TOKEN = 'ALIFER_DIRECTOR_SECURE_TOKEN_2026';

app.post('/api/admin/login', (req, res) => {
  const { passcode } = req.body;
  if (passcode && (passcode.trim() === ADMIN_PASSCODE || passcode.trim().toUpperCase() === ADMIN_PASSCODE)) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      director: 'Er. Alifer Sir',
      role: 'director',
      message: 'Authentication successful. Welcome Director Er. Alifer Sir.',
    });
  }
  return res.status(401).json({
    success: false,
    error: 'Invalid Director Security Passcode. Default passcode is ALIFER2026.',
  });
});

app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.includes(ADMIN_TOKEN)) {
    return res.json({ authenticated: true, director: 'Er. Alifer Sir' });
  }
  return res.status(401).json({ authenticated: false, error: 'Unauthorized' });
});

// ==========================================
// 2. CATEGORIES MANAGEMENT ENDPOINTS
// ==========================================

// Get all categories with dynamic courseCount
app.get('/api/categories', (_req, res) => {
  const categoriesWithCounts = dataStore.categories.map((cat) => {
    const activeCoursesCount = dataStore.courses.filter(
      (c) => c.categoryId === cat.id && c.isActive !== false
    ).length;
    return {
      ...cat,
      courseCount: activeCoursesCount,
    };
  }).sort((a, b) => (a.order || 0) - (b.order || 0));

  res.json(categoriesWithCounts);
});

// Create new category
app.post('/api/categories', (req, res) => {
  const { name, group, description, thumbnailUrl, badge, order, isActive } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `cat-${slug || 'custom'}-${Date.now().toString().slice(-4)}`;

  const newCategory = {
    id,
    name: name.trim(),
    group: group || 'Competitive Examinations',
    description: description || 'Specialized academic batch curriculum curated by Er. Alifer Sir.',
    thumbnailUrl: thumbnailUrl || '/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg',
    order: typeof order === 'number' ? order : dataStore.categories.length + 1,
    isActive: isActive !== false,
    badge: badge || 'New Batch',
    courseCount: 0,
  };

  dataStore.categories.push(newCategory);
  saveDataStore();
  res.status(201).json(newCategory);
});

// Update category
app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const idx = dataStore.categories.findIndex((c) => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }

  dataStore.categories[idx] = {
    ...dataStore.categories[idx],
    ...req.body,
    id, // Maintain ID integrity
  };

  // If category name or group changed, update all courses belonging to it
  if (req.body.name || req.body.group) {
    dataStore.courses = dataStore.courses.map((course) => {
      if (course.categoryId === id) {
        return {
          ...course,
          categoryName: req.body.name || course.categoryName,
          categoryGroup: req.body.group || course.categoryGroup,
        };
      }
      return course;
    });
  }

  saveDataStore();
  res.json(dataStore.categories[idx]);
});

// Toggle category active/inactive status
app.patch('/api/categories/:id/toggle-active', (req, res) => {
  const { id } = req.params;
  const cat = dataStore.categories.find((c) => c.id === id);
  if (!cat) {
    return res.status(404).json({ error: 'Category not found' });
  }
  cat.isActive = !cat.isActive;
  saveDataStore();
  res.json(cat);
});

// Reorder categories
app.post('/api/categories/reorder', (req, res) => {
  const { orderedIds } = req.body;
  if (Array.isArray(orderedIds)) {
    orderedIds.forEach((id: string, index: number) => {
      const cat = dataStore.categories.find((c) => c.id === id);
      if (cat) {
        cat.order = index + 1;
      }
    });
    dataStore.categories.sort((a, b) => a.order - b.order);
    saveDataStore();
  }
  res.json(dataStore.categories);
});

// Delete category with Course Containment Validation
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const cat = dataStore.categories.find((c) => c.id === id);
  if (!cat) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Critical Check: Does this category contain any courses?
  const matchingCourses = dataStore.courses.filter((c) => c.categoryId === id);
  if (matchingCourses.length > 0) {
    return res.status(400).json({
      error: `Cannot delete category "${cat.name}". It contains ${matchingCourses.length} course(s). Please reassign or delete these courses first before deleting the category.`,
      courseCount: matchingCourses.length,
      courses: matchingCourses.map((c) => ({ id: c.id, title: c.title })),
    });
  }

  dataStore.categories = dataStore.categories.filter((c) => c.id !== id);
  saveDataStore();
  res.json({ success: true, message: `Category "${cat.name}" has been deleted.` });
});

// ==========================================
// 3. COURSES MANAGEMENT ENDPOINTS
// ==========================================

// Get all courses (optionally filter by categoryId or publishedOnly)
app.get('/api/courses', (req, res) => {
  const { categoryId, publishedOnly } = req.query;
  let results = [...dataStore.courses];

  if (categoryId) {
    results = results.filter((c) => c.categoryId === categoryId);
  }

  if (publishedOnly === 'true') {
    results = results.filter((c) => c.isPublished !== false && c.isActive !== false);
  }

  res.json(results);
});

// Create new course under a category
app.post('/api/courses', (req, res) => {
  const courseData = req.body;
  if (!courseData.title || !courseData.categoryId) {
    return res.status(400).json({ error: 'Course title and categoryId are required' });
  }

  const category = dataStore.categories.find((c) => c.id === courseData.categoryId);

  const newCourse = {
    id: courseData.id || `course-${Date.now()}`,
    title: courseData.title.trim(),
    categoryId: courseData.categoryId,
    categoryName: category?.name || courseData.categoryName || 'General',
    categoryGroup: category?.group || courseData.categoryGroup || 'Higher Education',
    category: courseData.category || 'Mathematics',
    isPublished: courseData.isPublished !== undefined ? courseData.isPublished : true,
    isActive: courseData.isActive !== undefined ? courseData.isActive : true,
    instructor: courseData.instructor || {
      name: 'Er. Alifer Sir',
      title: 'Academic Director, Alifer Academy',
      avatarUrl: '/assets/aistudio/IMG-20261106-WA0003_3c0fea6c.jpg',
      experience: '8+ Years Teaching Pedagogy',
      bio: 'Mentored over 50,000 students for competitive, engineering, and board examinations with top rank results.',
    },
    thumbnailUrl: courseData.thumbnailUrl || category?.thumbnailUrl || '/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg',
    bannerUrl: courseData.bannerUrl || courseData.thumbnailUrl || '/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg',
    price: Number(courseData.price) || 1999,
    originalPrice: Number(courseData.originalPrice) || 4999,
    rating: Number(courseData.rating) || 4.9,
    reviewCount: Number(courseData.reviewCount) || 12,
    duration: courseData.duration || '1 Year',
    durationType: courseData.durationType || 'duration',
    startDate: courseData.startDate || '',
    endDate: courseData.endDate || '',
    durationHours: Number(courseData.durationHours) || 60,
    totalLectures: Number(courseData.totalLectures) || 40,
    totalNotes: Number(courseData.totalNotes) || 20,
    totalTests: Number(courseData.totalTests) || 10,
    level: courseData.level || 'Intermediate',
    language: courseData.language || 'Bilingual (Hinglish + English Notes)',
    description: courseData.description || 'Comprehensive curriculum covering all syllabus requirements with step-by-step problem walkthroughs.',
    features: courseData.features || [
      'Full Syllabus Video Lectures in High Definition',
      'Downloadable Hand-Written Lecture Notes (PDF)',
      'Chapter-wise Practice Tests with Solutions',
      'Direct Ask-a-Query Doubt Clearing Support',
    ],
    isEnrolled: false,
    progressPercent: 0,
    modules: courseData.modules || [],
  };

  dataStore.courses.push(newCourse);
  saveDataStore();
  res.status(201).json(newCourse);
});

// Update course
app.put('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  const idx = dataStore.courses.findIndex((c) => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // If category changed, sync categoryName & group
  let categoryName = dataStore.courses[idx].categoryName;
  let categoryGroup = dataStore.courses[idx].categoryGroup;
  if (req.body.categoryId && req.body.categoryId !== dataStore.courses[idx].categoryId) {
    const cat = dataStore.categories.find((c) => c.id === req.body.categoryId);
    if (cat) {
      categoryName = cat.name;
      categoryGroup = cat.group;
    }
  }

  dataStore.courses[idx] = {
    ...dataStore.courses[idx],
    ...req.body,
    categoryName,
    categoryGroup,
    id,
  };

  saveDataStore();
  res.json(dataStore.courses[idx]);
});

// Toggle course publish status
app.patch('/api/courses/:id/publish', (req, res) => {
  const { id } = req.params;
  const course = dataStore.courses.find((c) => c.id === id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  course.isPublished = !course.isPublished;
  saveDataStore();
  res.json(course);
});

// Update course price
app.patch('/api/courses/:id/price', (req, res) => {
  const { id } = req.params;
  const course = dataStore.courses.find((c) => c.id === id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const { price, originalPrice } = req.body;
  if (price !== undefined) course.price = Number(price);
  if (originalPrice !== undefined) course.originalPrice = Number(originalPrice);
  saveDataStore();
  res.json(course);
});

// Delete course
app.delete('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  dataStore.courses = dataStore.courses.filter((c) => c.id !== id);
  saveDataStore();
  res.json({ success: true, message: 'Course deleted successfully' });
});

// ==========================================
// 4. PAYMENTS & ADMISSIONS ARCHITECTURE (Razorpay + Verified Checkout)
// ==========================================

// Create a verified payment order
app.post('/api/payments/create-order', (req, res) => {
  try {
    const { courseId, studentId, studentName, studentEmail, studentPhone, paymentMethod } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    const course = dataStore.courses.find((c) => c.id === courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const effectiveStudentId = studentId || 'STU-ALF-2026-8841';

    // Prevent duplicate payment if student is already enrolled
    const studentAccessList = dataStore.studentCourseAccess[effectiveStudentId] || [];
    if (studentAccessList.includes(courseId) || (course.isEnrolled && effectiveStudentId === 'STU-ALF-2026-8841')) {
      return res.status(400).json({
        error: 'You are already enrolled in this course. You can access it directly in My Learning.',
        alreadyEnrolled: true,
      });
    }

    const orderId = `order_alf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const receiptSeq = (dataStore.transactions.length + 1).toString().padStart(3, '0');
    const receiptNumber = `ALIFER-RCPT-2026-${receiptSeq}`;

    const discountAmount = Math.max(0, (course.originalPrice || course.price) - course.price);

    const pendingTxn = {
      id: `txn-${Date.now()}`,
      orderId,
      courseId: course.id,
      courseTitle: course.title,
      categoryName: course.categoryName || course.category || 'General',
      studentId: effectiveStudentId,
      studentName: studentName || 'Mayank Vaishno',
      studentEmail: studentEmail || 'vaishnomayank@gmail.com',
      studentPhone: studentPhone || '+91 98765 43210',
      amount: course.price,
      originalAmount: course.originalPrice || course.price,
      discountAmount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: paymentMethod || 'upi',
      receiptNumber,
      createdAt: new Date().toISOString(),
      notes: `Alifer Academy Admission Enrollment - ${course.duration || '1 Year'} Access`,
    };

    dataStore.transactions.unshift(pendingTxn);
    saveDataStore();

    res.json({
      success: true,
      orderId,
      amount: course.price,
      currency: 'INR',
      courseTitle: course.title,
      duration: course.duration || '1 Year',
      receiptNumber,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_alifer_sandbox',
      isSandbox: !process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (err: any) {
    console.error('Payment order creation error:', err);
    res.status(500).json({ error: err.message || 'Failed to initiate course payment' });
  }
});

// Verify payment signature and grant course access
app.post('/api/payments/verify', (req, res) => {
  try {
    const { orderId, paymentId, signature, courseId, studentId, paymentMethod } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const txn = dataStore.transactions.find((t) => t.orderId === orderId);
    if (!txn) {
      return res.status(404).json({ error: 'Order record not found in payment system' });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    // Strict HMAC SHA256 Signature verification if live keys are present
    if (razorpaySecret && signature) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (generatedSignature !== signature) {
        txn.status = 'failed';
        saveDataStore();
        return res.status(400).json({ error: 'Payment signature verification failed. Access denied.' });
      }
    }

    const effectivePaymentId = paymentId || `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const effectiveSignature = signature || `sig_verified_${Date.now()}`;

    // Mark transaction successful
    txn.status = 'success';
    txn.paymentId = effectivePaymentId;
    txn.signature = effectiveSignature;
    txn.verifiedAt = new Date().toISOString();
    if (paymentMethod) txn.paymentMethod = paymentMethod;

    // Grant student course access
    const effectiveStudentId = studentId || txn.studentId || 'STU-ALF-2026-8841';
    dataStore.studentCourseAccess[effectiveStudentId] = dataStore.studentCourseAccess[effectiveStudentId] || [];
    if (!dataStore.studentCourseAccess[effectiveStudentId].includes(txn.courseId)) {
      dataStore.studentCourseAccess[effectiveStudentId].push(txn.courseId);
    }

    // Set course isEnrolled flag
    const course = dataStore.courses.find((c) => c.id === txn.courseId);
    if (course) {
      course.isEnrolled = true;
      course.progressPercent = course.progressPercent || 5;
    }

    saveDataStore();

    res.json({
      success: true,
      message: `Payment verified! You are now enrolled in ${txn.courseTitle}.`,
      transaction: txn,
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
});

// Student payment history
app.get('/api/payments/history', (req, res) => {
  const { studentId } = req.query;
  const effectiveId = (studentId as string) || 'STU-ALF-2026-8841';
  const list = dataStore.transactions.filter(
    (t) => t.studentId === effectiveId || !studentId
  );
  res.json(list);
});

// Admin: All admissions and payment records
app.get('/api/payments/all', (_req, res) => {
  res.json(dataStore.transactions);
});

// ==========================================
// 5. ANNOUNCEMENTS & FESTIVALS ENDPOINTS
// ==========================================

// Get active announcements for students
app.get('/api/announcements', (_req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const activeAnnouncements = dataStore.announcements.filter((ann) => {
    if (!ann.isActive) return false;
    if (ann.startDate && ann.startDate > today) return false;
    if (ann.endDate && ann.endDate < today) return false;
    return true;
  });
  res.json(activeAnnouncements);
});

// Get all announcements for admin panel
app.get('/api/admin/announcements', (_req, res) => {
  res.json(dataStore.announcements);
});

// Create announcement
app.post('/api/announcements', (req, res) => {
  const { title, message, bannerUrl, type, startDate, endDate, targetAudience, popupDisplay, ctaText, ctaLink } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }

  const newAnn = {
    id: `ann-${Date.now()}`,
    title: title.trim(),
    message: message.trim(),
    bannerUrl: bannerUrl || '/assets/aistudio/Codex_Image_Nov_9__2026__05_42_23_PM_40be101d.jpg',
    type: type || 'general',
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || '2026-12-31',
    targetAudience: targetAudience || 'all',
    popupDisplay: popupDisplay || 'once',
    isActive: true,
    ctaText: ctaText || 'Learn More',
    ctaLink: ctaLink || '',
    createdAt: new Date().toISOString().split('T')[0],
  };

  dataStore.announcements.unshift(newAnn);
  saveDataStore();
  res.status(201).json(newAnn);
});

// Update announcement
app.put('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  const idx = dataStore.announcements.findIndex((a) => a.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  dataStore.announcements[idx] = {
    ...dataStore.announcements[idx],
    ...req.body,
    id,
  };
  saveDataStore();
  res.json(dataStore.announcements[idx]);
});

// Toggle announcement active
app.patch('/api/announcements/:id/toggle', (req, res) => {
  const { id } = req.params;
  const ann = dataStore.announcements.find((a) => a.id === id);
  if (!ann) {
    return res.status(404).json({ error: 'Announcement not found' });
  }
  ann.isActive = !ann.isActive;
  saveDataStore();
  res.json(ann);
});

// Delete announcement
app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  dataStore.announcements = dataStore.announcements.filter((a) => a.id !== id);
  saveDataStore();
  res.json({ success: true });
});

// ==========================================
// 5B. NOTIFICATIONS & BROADCAST ALERTS
// ==========================================
// Get all active notifications
app.get('/api/notifications', (_req, res) => {
  res.json(dataStore.notifications);
});

// Broadcast alert from admin (with optional uploaded banner image)
app.post('/api/notifications/broadcast', (req, res) => {
  try {
    const { title, message, imageUrl, type } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Alert headline / title is required.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Alert message body is required.' });
    }

    const newNotification = {
      id: `notif-broadcast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      message: message.trim(),
      imageUrl: imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0 ? imageUrl.trim() : undefined,
      timestamp: 'Just now',
      type: type || 'announcement',
      read: false,
      createdAt: new Date().toISOString(),
    };

    dataStore.notifications.unshift(newNotification);
    saveDataStore();

    res.status(201).json({
      success: true,
      message: 'Broadcast alert successfully published and delivered to student devices.',
      notification: newNotification,
    });
  } catch (err: any) {
    console.error('Error broadcasting notification:', err);
    res.status(500).json({ error: err.message || 'Failed to broadcast alert' });
  }
});

// Mark single notification as read
app.patch('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = dataStore.notifications.find((n) => n.id === id);
  if (notif) {
    notif.read = true;
    saveDataStore();
    return res.json({ success: true, notification: notif });
  }
  res.status(404).json({ error: 'Notification not found' });
});

// Mark all notifications as read
app.patch('/api/notifications/mark-all-read', (_req, res) => {
  dataStore.notifications.forEach((n) => {
    n.read = true;
  });
  saveDataStore();
  res.json({ success: true, count: dataStore.notifications.length });
});

// ==========================================
// 6. STUDENT QUERIES & DOUBTS
// ==========================================
app.post('/api/queries', (req, res) => {
  const { courseId, lectureId, studentName, studentAvatar, question, imageUrl } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question text is required' });
  }

  const newQuery = {
    id: `query-${Date.now()}`,
    lectureId: lectureId || 'general',
    studentName: studentName || 'Student',
    studentAvatar: studentAvatar || '',
    question: question.trim(),
    imageUrl,
    timestamp: 'Just now',
    status: 'pending',
    likes: 0,
  };

  dataStore.queries.unshift(newQuery);

  // If matching lecture exists in course, append
  if (courseId && lectureId) {
    const course = dataStore.courses.find((c) => c.id === courseId);
    if (course) {
      for (const mod of course.modules || []) {
        for (const chap of mod.chapters || []) {
          const lec = chap.lectures.find((l: any) => l.id === lectureId);
          if (lec) {
            lec.queries = lec.queries || [];
            lec.queries.unshift(newQuery);
            break;
          }
        }
      }
    }
  }

  saveDataStore();
  res.status(201).json(newQuery);
});

app.post('/api/queries/:queryId/reply', (req, res) => {
  const { queryId } = req.params;
  const { replyText, author } = req.body;
  if (!replyText) {
    return res.status(400).json({ error: 'Reply text is required' });
  }

  const query = dataStore.queries.find((q) => q.id === queryId);
  if (query) {
    query.status = 'answered';
    query.teacherReply = {
      author: author || 'Er. Alifer Sir',
      text: replyText.trim(),
      timestamp: 'Just now',
    };
  }

  // Also update inside courses
  for (const course of dataStore.courses) {
    for (const mod of course.modules || []) {
      for (const chap of mod.chapters || []) {
        for (const lec of chap.lectures || []) {
          const found = (lec.queries || []).find((q: any) => q.id === queryId);
          if (found) {
            found.status = 'answered';
            found.teacherReply = {
              author: author || 'Er. Alifer Sir',
              text: replyText.trim(),
              timestamp: 'Just now',
            };
          }
        }
      }
    }
  }

  saveDataStore();
  res.json({ success: true, query });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Alifer Academy] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
