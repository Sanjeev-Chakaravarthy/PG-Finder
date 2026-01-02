const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const connectDB = require('./config/db');

const passport = require("passport");
require("./config/passport");

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// ============================================
// FIXED CORS CONFIGURATION
// ============================================

// Define allowed origins
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://pg-haven.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

// CORS Configuration - MUST BE BEFORE OTHER MIDDLEWARE
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware FIRST
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware (Required for Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint (important for Render)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'PG Haven API is healthy',
    timestamp: new Date().toISOString(),
    allowedOrigins: allowedOrigins,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'PG Haven API is running...',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      rooms: '/api/rooms/*'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err);
  
  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy violation',
      message: 'Origin not allowed',
      allowedOrigins: allowedOrigins
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 Allowed CORS origins:`, allowedOrigins);
  console.log(`📁 Upload directory: ${path.join(__dirname, 'uploads')}`);
});

module.exports = app;