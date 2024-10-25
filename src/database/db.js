import mongoose from 'mongoose';
import process from 'process';

// Function to connect to MongoDB with retry logic
const connectDB = async (url ,retries = 5, delay = 5000) => {
  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
   if (retries === 0) {
      console.error('All retries exhausted. Exiting...');
      process.exit(1);
    } else {
      console.log(`Retrying in ${delay / 1000} seconds... (${retries} retries left)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    }
  }
};

// Handling different connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from DB');
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

export default connectDB;