import mongoose from 'mongoose';
import { env } from './utils/env';

const mongoDB = env.DB_CONNECTION_STRING;

mongoose.set('strictQuery', false);

const connectDB = async () => {
  const displayUrl = mongoDB.replace(/(\/\/[^:]+):([^@]+)@/, '$1:<hidden>@');
  console.log(`MongoDB: Connecting to ${displayUrl}`);

  try {
    await mongoose.connect(mongoDB);
    console.log('MongoDB: connected...');
    // await createAdminUser();
  } catch (error) {
    console.error('MongoDB: connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
