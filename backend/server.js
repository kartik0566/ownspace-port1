import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const defaultAllowedOrigins = [5173, 5174, 5175].flatMap((port) => [
  `http://localhost:${port}`,
  `http://127.0.0.1:${port}`,
  `http://[::1]:${port}`,
]);

const envAllowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...defaultAllowedOrigins,
  ...envAllowedOrigins,
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS policy does not allow access from ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.get('/api', (req, res) => {
  res.json({
    status: 'Portfolio API is running',
    health: '/api/health',
    auth: '/api/auth',
    portfolio: '/api/portfolio/:username',
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

export default app;
