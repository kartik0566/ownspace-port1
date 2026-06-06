import express from 'express';
import {
  getAllEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import authMiddleware, { optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthMiddleware, getAllEducation);
router.post('/', authMiddleware, addEducation);
router.put('/:id', authMiddleware, updateEducation);
router.delete('/:id', authMiddleware, deleteEducation);

export default router;
