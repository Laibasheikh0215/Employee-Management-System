const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('🔄 Testing MongoDB Atlas connection...');
  console.log('📡 Connection string:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//*****@'));
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });
    console.log('✅ Connected to MongoDB Atlas successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your internet connection');
    console.log('2. Make sure IP is whitelisted in Atlas');
    console.log('3. Verify username and password are correct');
    console.log('4. Try using local MongoDB instead');
    process.exit(1);
  }
}

testConnection();