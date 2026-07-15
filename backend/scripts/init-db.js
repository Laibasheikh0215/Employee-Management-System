const mongoose = require('mongoose');

async function initDatabase() {
  try {
    // Collections create karo
    await mongoose.connection.db.createCollection('users');
    await mongoose.connection.db.createCollection('employees');
    
    // Indexes create karo
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ username: 1 }, { unique: true });
    await mongoose.connection.db.collection('employees').createIndex({ email: 1 }, { unique: true });
    
    console.log('✅ Database initialized with collections and indexes');
    
    // Admin user create karo
    const bcrypt = require('bcryptjs');
    const adminExists = await mongoose.connection.db.collection('users').findOne({ email: 'admin@test.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await mongoose.connection.db.collection('users').insertOne({
        username: 'admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date()
      });
      console.log('✅ Admin user created: admin@test.com / admin123');
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
  }
}

module.exports = initDatabase;