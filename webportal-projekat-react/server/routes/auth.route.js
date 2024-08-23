import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/google', authController.google);

export default router;