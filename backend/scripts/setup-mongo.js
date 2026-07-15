const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function startMongoDB() {
  try {
    // MongoDB in-memory server start karo
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    console.log('✅ MongoDB started at:', uri);
    
    // Mongoose se connect karo
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    
    // Process end hone par server stop karo
    process.on('SIGINT', async () => {
      await mongoose.disconnect();
      await mongod.stop();
      console.log('MongoDB stopped');
      process.exit(0);
    });
    
    return { mongod, uri };
  } catch (error) {
    console.error('❌ MongoDB start failed:', error.message);
    process.exit(1);
  }
}

module.exports = startMongoDB;