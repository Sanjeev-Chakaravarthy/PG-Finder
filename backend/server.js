const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const session = require('express-session'); // ADD THIS
const path = require('path');
const connectDB = require('./config/db');

const passport = require("passport");
require("./config/passport");

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// ADD SESSION MIDDLEWARE (Required for Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); // ADD THIS

// Serve Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
  res.send('PG Haven API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});