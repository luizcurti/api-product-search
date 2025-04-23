import mongoose from 'mongoose';

const mongoURI: string = process.env.MONGO_URI || 'mongodb://mongo:27017/product';

const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB!');
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    console.error('Error connecting to MongoDB:', errorMessage);
    process.exit(1);
  }
};

export default connectMongoDB;
