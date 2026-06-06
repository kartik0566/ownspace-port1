import express from 'express';
import {
  submitContact,
  getAllSubmissions,
  updateSubmission,
  deleteSubmission,
} from '../controllers/contactController.js';
import authMiddleware, { optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuthMiddleware, submitContact);
router.get('/', authMiddleware, getAllSubmissions);
router.put('/:id', authMiddleware, updateSubmission);
router.delete('/:id', authMiddleware, deleteSubmission);

export default router;
