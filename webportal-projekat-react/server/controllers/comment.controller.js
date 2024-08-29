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

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({})
      .populate('userId')
      .populate('postId')
      .exec();
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({
        createdAt: -1,
      })
      .populate('userId')
      .populate('postId')
      .exec();

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('userId')
      .populate('postId')
      .exec();

    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.likes.push(req.user.id);
      comment.numberOfLikes += 1;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.numberOfLikes -= 1;
    }

    await comment.save();
    res.status(202).json(comment);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    if (comment.userId._id !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, 'You are not allowed to update this comment')
      );
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        content: req.body.content,
      },
      { new: true }
    );

    await updatedComment.save();
    res.status(202).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }

    if (comment.userId._id !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, 'You are not allowed to delete this comment')
      );
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error);
  }
};
   