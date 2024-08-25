import express from 'express';
import * as userController from '../controllers/user.controller.js';
import verifyToken from '../middlewares/verifyUser.js';
const router = express.Router();

// POST Endpoints
router.post('/signout', verifyToken, userController.signOut);

// PUT Endpoints
router.put('/update/:userId', verifyToken, userController.updateUser);


// DELETE Enpoints
router.delete('/delete/:userId', verifyToken, userController.deleteUser);

export default router;