// server/src/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    //test environment
    const isTestEnv = process.env.NODE_ENV === 'test';

    const mongoURI = isTestEnv
      ? process.env.MONGO_URI_TEST
      : process.env.MONGO_URI;

    if (isTestEnv) {
      console.log('🧪 Connecting to TEST Database...');
    }

    if (!mongoURI) {
      console.error('🛑 MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`🛑 Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error('🛑 Unknown error connecting to MongoDB');
    }
    process.exit(1);
  }
};

export default connectDB;