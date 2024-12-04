import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectToMongoDB from './utils/dbConnect.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';



dotenv.config();
const port = process.env.PORT || 8000;

connectToMongoDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/api', (req, res) => {
  res.status(200).send({
    message: 'API Works',
  });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
