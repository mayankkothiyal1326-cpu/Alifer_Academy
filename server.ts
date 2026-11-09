import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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
  });
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
