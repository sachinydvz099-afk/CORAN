import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { queueSceneGeneration } from '../services/queue.service';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, prompt_text, target_length_minutes, style } = req.body;
    const userId = req.userId!;

    const project = await prisma.project.create({
      data: {
        userId,
        title,
        description,
        promptText: prompt_text,
        targetLengthMinutes: target_length_minutes,
        style,
        status: 'draft',
      },
    });

    res.status(201).json({
      project_id: project.id,
      user_id: project.userId,
      title: project.title,
      description: project.description,
      prompt_text: project.promptText,
      target_length_minutes: project.targetLengthMinutes,
      style: project.style,
      status: project.status,
      created_at: project.createdAt,
      updated_at: project.updatedAt,
    });
  } catch (error) {
    throw error;
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { characters: true, scenes: true },
        },
      },
    });

    res.json({
      projects: projects.map(p => ({
        project_id: p.id,
        title: p.title,
        status: p.status,
        style: p.style,
        target_length_minutes: p.targetLengthMinutes,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
        thumbnail_url: p.thumbnailUrl,
        character_count: p._count.characters,
        scene_count: p._count.scenes,
      })),
    });
  } catch (error) {
    throw error;
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        characters: true,
        scenes: {
          orderBy: { sceneNumber: 'asc' },
        },
        _count: {
          select: { renderJobs: true },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.json({
      project_id: project.id,
      user_id: project.userId,
      title: project.title,
      description: project.description,
      prompt_text: project.promptText,
      target_length_minutes: project.targetLengthMinutes,
      style: project.style,
      status: project.status,
      created_at: project.createdAt,
      updated_at: project.updatedAt,
      completed_at: project.completedAt,
      characters: project.characters,
      scenes: project.scenes,
      render_job_count: project._count.renderJobs,
    });
  } catch (error) {
    throw error;
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const updates = req.body;

    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(updates.title && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.prompt_text && { promptText: updates.prompt_text }),
        ...(updates.target_length_minutes && { targetLengthMinutes: updates.target_length_minutes }),
        ...(updates.style && { style: updates.style }),
        ...(updates.status && { status: updates.status }),
      },
    });

    res.json({
      project_id: updatedProject.id,
      user_id: updatedProject.userId,
      title: updatedProject.title,
      description: updatedProject.description,
      prompt_text: updatedProject.promptText,
      target_length_minutes: updatedProject.targetLengthMinutes,
      style: updatedProject.style,
      status: updatedProject.status,
      updated_at: updatedProject.updatedAt,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    await prisma.project.delete({ where: { id } });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    throw error;
  }
};
