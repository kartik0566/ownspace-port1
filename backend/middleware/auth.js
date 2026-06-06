import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/ownership.js';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret());
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const optionalAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next();
  }

  try {
    req.user = jwt.verify(token, jwtSecret());
  } catch {
    req.user = null;
  }

  next();
};

export default authMiddleware;
