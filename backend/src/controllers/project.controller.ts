import { Response } from 'express';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { Project } from '../models/Project';
import { Character } from '../models/Character';
import { Scene } from '../models/Scene';
import { RenderJob } from '../models/RenderJob';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, prompt_text, target_length_minutes, style } = req.body;
    const userId = req.userId!;

    const project = await Project.create({
      userId,
      title,
      description,
      promptText: prompt_text,
      targetLengthMinutes: target_length_minutes,
      style,
      status: 'draft',
    });

    res.status(201).json({
      project_id: project._id,
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

    const projects = await Project.find({ userId }).sort({ createdAt: -1 });

    const projectsWithCounts = await Promise.all(
      projects.map(async (p) => {
        const characterCount = await Character.countDocuments({ projectId: p._id });
        const sceneCount = await Scene.countDocuments({ projectId: p._id });
        
        return {
          project_id: p._id,
          title: p.title,
          status: p.status,
          style: p.style,
          target_length_minutes: p.targetLengthMinutes,
          created_at: p.createdAt,
          updated_at: p.updatedAt,
          thumbnail_url: p.thumbnailUrl,
          character_count: characterCount,
          scene_count: sceneCount,
        };
      })
    );

    res.json({ projects: projectsWithCounts });
  } catch (error) {
    throw error;
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const characters = await Character.find({ projectId: id });
    const scenes = await Scene.find({ projectId: id }).sort({ sceneNumber: 1 });
    const renderJobCount = await RenderJob.countDocuments({ projectId: id });

    res.json({
      project_id: project._id,
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
      characters: characters,
      scenes: scenes,
      render_job_count: renderJobCount,
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

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const updateData: any = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.prompt_text) updateData.promptText = updates.prompt_text;
    if (updates.target_length_minutes) updateData.targetLengthMinutes = updates.target_length_minutes;
    if (updates.style) updateData.style = updates.style;
    if (updates.status) updateData.status = updates.status;

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

    res.json({
      project_id: updatedProject!._id,
      user_id: updatedProject!.userId,
      title: updatedProject!.title,
      description: updatedProject!.description,
      prompt_text: updatedProject!.promptText,
      target_length_minutes: updatedProject!.targetLengthMinutes,
      style: updatedProject!.style,
      status: updatedProject!.status,
      updated_at: updatedProject!.updatedAt,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const project = await Project.findOne({ _id: id, userId });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    await Project.findByIdAndDelete(id);
    await Character.deleteMany({ projectId: id });
    await Scene.deleteMany({ projectId: id });
    await RenderJob.deleteMany({ projectId: id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    throw error;
  }
};
