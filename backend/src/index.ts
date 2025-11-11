import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import characterRoutes from './routes/character.routes';
import sceneRoutes from './routes/scene.routes';
import renderRoutes from './routes/render.routes';
import billingRoutes from './routes/billing.routes';
import voiceRoutes from './routes/voice.routes';
import notificationRoutes from './routes/notification.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', characterRoutes);
app.use('/api/projects', sceneRoutes);
app.use('/api', renderRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/voice_styles', voiceRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDatabase();
  
  app.listen(PORT, () => {
    logger.info(`🚀 AI-Studio Backend running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

export default app;
