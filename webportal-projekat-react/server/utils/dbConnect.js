import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectToMongoDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error(err);
    });
};

export default connectToMongoDB;