import express from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import authMiddleware, { optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthMiddleware, getAbout);
router.put('/', authMiddleware, updateAbout);

export default router;
