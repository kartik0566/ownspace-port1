import express from 'express';
import {
  getAllExperience,
  addExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import authMiddleware, { optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthMiddleware, getAllExperience);
router.post('/', authMiddleware, addExperience);
router.put('/:id', authMiddleware, updateExperience);
router.delete('/:id', authMiddleware, deleteExperience);

export default router;
