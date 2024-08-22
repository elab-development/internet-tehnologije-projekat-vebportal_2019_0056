import bcryptjs from 'bcryptjs';
import User from '../models/User.model.js';
import errorHandler from '../middlewares/errorHandler.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).send({
      message: 'User signed up successfully',
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};