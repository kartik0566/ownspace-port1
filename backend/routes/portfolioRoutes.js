import express from 'express';
import { getPortfolio } from '../controllers/portfolioController.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/:username', optionalAuthMiddleware, getPortfolio);

export default router;
