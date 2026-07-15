const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const startMongoDB = require('./scripts/setup-mongo');
const initDatabase = require('./scripts/init-db');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes import
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message });
});

// Start MongoDB and Server
async function startServer() {
  try {
    // MongoDB automatically start ho jayega
    const { uri } = await startMongoDB();
    console.log('📡 MongoDB URI:', uri);
    
    // Database initialize karo
    await initDatabase();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server start failed:', error.message);
    process.exit(1);
  }
}

startServer();