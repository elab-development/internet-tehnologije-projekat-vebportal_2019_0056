import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectToMongoDB from './utils/dbConnect.js';

dotenv.config();
const port = process.env.PORT || 8000;

connectToMongoDB();

const app = express();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
