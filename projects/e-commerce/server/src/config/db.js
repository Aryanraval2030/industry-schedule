import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';
  
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Primary connection failed (${err.message}). Attempting in-memory database fallback...`);
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const inMemoryUri = memoryServer.getUri();
      
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected to dynamic in-memory database at: ${inMemoryUri}`);
      console.log(`[MongoDB Tip] You can also connect to MongoDB Atlas by setting MONGO_URI in server/.env`);
      return conn;
    } catch (fallbackErr) {
      console.error(`[MongoDB] Could not establish database connection:`, fallbackErr.message);
      throw fallbackErr;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
