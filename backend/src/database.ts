import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const url = process.env.DATABASE_URL;

  try {
    if (!url) {
      throw new Error('Please set the DATABASE_URL environment variable');
    }
    const conn = await mongoose.connect(url);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
