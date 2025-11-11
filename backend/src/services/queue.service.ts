import { Queue, Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { logger } from '../utils/logger';
import { prisma } from '../utils/prisma';
import { processSceneGeneration, processFinalVideoRender, processSceneRender } from './render.service';

// Redis connection disabled for development without Redis
const connection = process.env.REDIS_HOST ? new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
}) : null;

// Define queues (skip if no Redis connection)
export const renderQueue = connection ? new Queue('render', { connection }) : null;
export const sceneQueue = connection ? new Queue('scene', { connection }) : null;

// Queue job for rendering
export async function queueRenderJob(jobId: string, data: any) {
  if (!renderQueue) {
    logger.warn('Redis not available, skipping render job queue');
    return;
  }
  await renderQueue.add('render-job', { jobId, ...data }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
  logger.info(`Queued render job: ${jobId}`);
}

// Queue job for scene generation
export async function queueSceneGeneration(projectId: string, data: any) {
  if (!sceneQueue) {
    logger.warn('Redis not available, skipping scene generation queue');
    return;
  }
  await sceneQueue.add('scene-generation', { projectId, ...data }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
  logger.info(`Queued scene generation for project: ${projectId}`);
}

// Render worker (skip if no connection)
export const renderWorker = connection ? new Worker(
  'render',
  async (job: Job) => {
    logger.info(`Processing render job: ${job.id}`);
    
    try {
      const { jobId, jobType } = job.data;
      
      // Update job status
      await prisma.renderJob.update({
        where: { id: jobId },
        data: { status: 'running', startedAt: new Date() },
      });

      let outputUrl: string;

      if (jobType === 'final_video_render') {
        outputUrl = await processFinalVideoRender(job.data);
      } else if (jobType === 'scene_render') {
        outputUrl = await processSceneRender(job.data);
      } else {
        throw new Error(`Unknown job type: ${jobType}`);
      }

      // Update job as completed
      await prisma.renderJob.update({
        where: { id: jobId },
        data: {
          status: 'success',
          completedAt: new Date(),
          outputUrl,
        },
      });

      logger.info(`Completed render job: ${jobId}`);
      return { success: true, outputUrl };
    } catch (error: any) {
      logger.error(`Failed render job: ${job.id}`, error);
      
      await prisma.renderJob.update({
        where: { id: job.data.jobId },
        data: {
          status: 'failed',
          completedAt: new Date(),
          errorMessage: error.message,
        },
      });

      throw error;
    }
  },
  { connection }
) : null;

// Scene generation worker
export const sceneWorker = connection ? new Worker(
  'scene',
  async (job: Job) => {
    logger.info(`Processing scene generation: ${job.id}`);
    
    try {
      const { projectId } = job.data;
      await processSceneGeneration(projectId, job.data);
      logger.info(`Completed scene generation for project: ${projectId}`);
      return { success: true };
    } catch (error: any) {
      logger.error(`Failed scene generation: ${job.id}`, error);
      throw error;
    }
  },
  { connection }
) : null;

if (renderWorker) {
  renderWorker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed`);
  });

  renderWorker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed:`, err);
  });
}

if (sceneWorker) {
  sceneWorker.on('completed', (job) => {
    logger.info(`Scene job ${job.id} completed`);
  });

  sceneWorker.on('failed', (job, err) => {
    logger.error(`Scene job ${job?.id} failed:`, err);
  });
}
