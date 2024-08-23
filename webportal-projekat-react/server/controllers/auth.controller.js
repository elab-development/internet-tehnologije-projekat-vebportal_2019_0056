import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import errorHandler from '../middlewares/errorHandler.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, 'All fields are required'));
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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return next(errorHandler(401, 'Wrong password!'));
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: pass, ...rest } = user._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      // Sign In
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password: pass, ...rest } = user._doc;

      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json(rest);
    } else {
      // Sign Up
      const generatedRandomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedRandomPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password: pass, ...rest } = newUser._doc;

      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};