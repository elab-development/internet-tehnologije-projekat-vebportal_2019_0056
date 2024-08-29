import Comment from '../models/Comment.model.js';
import errorHandler from '../middlewares/errorHandler.js';

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, 'Unauthorized'));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};