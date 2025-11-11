import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
// import { queueRenderJob } from '../services/queue.service';

export const createRenderJob = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { render_type, resolution, output_format, notify_on_complete, scene_id } = req.body;
    const userId = req.userId!;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Create render job
    const job = await prisma.renderJob.create({
      data: {
        projectId: id,
        jobType: render_type === 'final_video' ? 'final_video_render' : 'scene_render',
        payload: {
          resolution,
          output_format,
          notify_on_complete,
          ...(scene_id && { scene_id }),
        },
        status: 'queued',
      },
    });

    // Queue the job for processing
    // await queueRenderJob(job.id, {
    //   projectId: id,
    //   jobType: job.jobType,
    //   payload: job.payload,
    // });

    res.status(202).json({
      job_id: job.id,
      project_id: job.projectId,
      job_type: job.jobType,
      status: job.status,
      started_at: job.startedAt,
      completed_at: job.completedAt,
      output_url: job.outputUrl,
    });
  } catch (error) {
    throw error;
  }
};

export const getRenderJobStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.userId!;

    const job = await prisma.renderJob.findFirst({
      where: {
        id: jobId,
        project: {
          userId,
        },
      },
      include: {
        project: true,
      },
    });

    if (!job) {
      throw new AppError('Render job not found', 404);
    }

    res.json({
      job_id: job.id,
      project_id: job.projectId,
      job_type: job.jobType,
      status: job.status,
      started_at: job.startedAt,
      completed_at: job.completedAt,
      output_url: job.outputUrl,
      error_message: job.errorMessage,
    });
  } catch (error) {
    throw error;
  }
};
