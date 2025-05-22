const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const startReminderJob = require('./jobs/reminderJob');

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:3000', // For local development
  'https://library-management-system-umber-six.vercel.app' ];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl/postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/student', userRoutes);

// Start background jobs
startReminderJob();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
