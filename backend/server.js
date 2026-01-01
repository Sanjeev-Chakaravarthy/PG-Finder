const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Required for image serving
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// --- CRITICAL: Serve Uploads Folder ---
// This allows http://localhost:5001/uploads/filename.jpg to work
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
  res.send('PG Haven API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});