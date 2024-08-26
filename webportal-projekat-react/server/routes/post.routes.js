import express from 'express';
import * as postController from '../controllers/post.controller.js';
import verifyToken from '../middlewares/verifyUser.js';

const router = express.Router();

// POST Endpoints
router.post('/', verifyToken, postController.createPost);

export default router;