import express from 'express';
import * as categoryController from '../controllers/category.controller.js';
import verifyToken from '../middlewares/verifyUser.js';

const router = express.Router();

// POST Endpoints
router.post('/', categoryController.createCategory);

// GET Endpoints
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// PUT Endpoints
router.put('/:id', categoryController.updateCategory);

// DELETE Enpoints
router.delete('/:id', categoryController.deleteCategory);

export default router;