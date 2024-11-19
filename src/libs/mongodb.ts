import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URI is not defined');
    }
    // Connect to MongoDB without the deprecated options
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
};

export default connectMongoDB;
