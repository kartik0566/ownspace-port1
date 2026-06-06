import express from 'express';
import {
  getAllProjects,
  addProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import authMiddleware, { optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthMiddleware, getAllProjects);
router.post('/', authMiddleware, addProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

export default router;
