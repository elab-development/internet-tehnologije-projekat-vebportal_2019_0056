import Post from '../models/Post.model.js';
import errorHandler from '../middlewares/errorHandler.js';

export const createPost = async (req, res, next) => {
  if (!(req.user.isAdmin || req.user.isEditor)) {
    return next(
      errorHandler(
        403,
        'Not an admin/editor. You are not allowed to create a post!'
      )
    );
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide required fields!'));
  }

  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '-');

  const newPost = new Post({
    ...req.body,
    slug,
    author: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};