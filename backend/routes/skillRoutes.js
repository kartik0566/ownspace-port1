import express from 'express';
import {
  getAllSkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import authMiddleware, { optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthMiddleware, getAllSkills);
router.post('/', authMiddleware, addSkill);
router.put('/:id', authMiddleware, updateSkill);
router.delete('/:id', authMiddleware, deleteSkill);

export default router;
