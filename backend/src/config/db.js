const mongoose = require('mongoose');

// بدون MONGO_URI (تطوير محلي فقط) نستعمل قاعدة بيانات مؤقتة في الذاكرة.
async function connectDB() {
  let uri = process.env.MONGO_URI;
  if (!uri) {
    if (process.env.NODE_ENV === 'production') throw new Error('MONGO_URI is required');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    uri = mem.getUri('dmt');
    console.log('using in-memory MongoDB (dev only, data is lost on restart)');
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = connectDB;
