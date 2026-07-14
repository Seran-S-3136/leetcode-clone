import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/apiRoutes';
import './config/firebase'; // Initialize Firebase Admin modular config
import { seedDatabaseToFirebase } from './services/seedDatabaseService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // Limit each IP to 120 requests per window
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'LeetCode Clone Execution & Scraper Service',
    timestamp: new Date().toISOString()
  });
});

// Automatically ensure problems are seeded into Firebase Firestore database on startup
seedDatabaseToFirebase(false).catch((err) => {
  console.warn('Startup auto-seed warning:', err);
});

app.listen(PORT, () => {
  console.log(`🚀 LeetCode Clone Backend running on http://localhost:${PORT}`);
});

export default app;
