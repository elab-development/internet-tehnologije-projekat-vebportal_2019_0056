import express from 'express';
import * as postController from '../controllers/post.controller.js';
import verifyToken from '../middlewares/verifyUser.js';

const router = express.Router();

// POST Endpoints
router.post('/', verifyToken, postController.createPost);

// GET Endpoints
router.get('/', postController.getPosts);

// PUT Endpoints
router.put(
    '/content/:postId/:userId',
    verifyToken,
    postController.updateContent
  );
  router.put('/:postId/:userId', verifyToken, postController.updatePost);
  
  // DELETE Endpoints
  router.delete('/:postId/:userId', verifyToken, postController.deletePost);

export default router;