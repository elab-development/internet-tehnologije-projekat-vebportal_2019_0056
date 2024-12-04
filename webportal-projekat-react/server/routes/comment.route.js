import express from 'express';
import * as commentController from '../controllers/comment.controller.js';
import verifyToken from '../middlewares/verifyUser.js';

const router = express.Router();

// POST Endpoints
router.post('/', verifyToken, commentController.createComment);

// GET Endpoints
router.get('/', verifyToken, commentController.getComments);
router.get('/getPostComments/:postId', commentController.getPostComments);

router.get('/:id', commentController.getComment);

// PUT Endpoints
router.put('/like/:commentId', verifyToken, commentController.likeComment);
router.put('/:id', verifyToken, commentController.updateComment);

// DELETE Endpoints
router.delete('/:id', verifyToken, commentController.deleteComment);

export default router;