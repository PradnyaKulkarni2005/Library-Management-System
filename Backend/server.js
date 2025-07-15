import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import startReminderJob from './jobs/reminderJob.js';

const app = express();

// ✅ CORS Configuration (simplified and safe)
const corsOptions = {
  origin: ['http://localhost:3000', 'https://library-management-system-umber-six.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ✅ Preflight support

app.use(bodyParser.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/student', userRoutes);

// ✅ Background job
startReminderJob();

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
