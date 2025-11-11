import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getScenes = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const scenes = await prisma.scene.findMany({
      where: { projectId: id },
      orderBy: { sceneNumber: 'asc' },
      include: {
        sceneCharacters: {
          include: {
            character: true,
          },
        },
      },
    });

    res.json({
      scenes: scenes.map(s => ({
        scene_id: s.id,
        project_id: s.projectId,
        scene_number: s.sceneNumber,
        title: s.title,
        start_time_seconds: s.startTimeSeconds,
        end_time_seconds: s.endTimeSeconds,
        status: s.status,
        storyboard_url: s.storyboardUrl,
        dialogue_text: s.dialogueText,
        characters: s.sceneCharacters.map(sc => sc.character),
        created_at: s.createdAt,
        updated_at: s.updatedAt,
      })),
    });
  } catch (error) {
    throw error;
  }
};

export const updateScene = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, sceneId } = req.params;
    const userId = req.userId!;
    const updates = req.body;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const scene = await prisma.scene.findFirst({
      where: { id: sceneId, projectId },
    });

    if (!scene) {
      throw new AppError('Scene not found', 404);
    }

    const updated = await prisma.scene.update({
      where: { id: sceneId },
      data: {
        ...(updates.title && { title: updates.title }),
        ...(updates.start_time_seconds !== undefined && { startTimeSeconds: updates.start_time_seconds }),
        ...(updates.end_time_seconds !== undefined && { endTimeSeconds: updates.end_time_seconds }),
        ...(updates.status && { status: updates.status }),
        ...(updates.dialogue_text !== undefined && { dialogueText: updates.dialogue_text }),
      },
    });

    res.json({
      scene_id: updated.id,
      project_id: updated.projectId,
      scene_number: updated.sceneNumber,
      title: updated.title,
      start_time_seconds: updated.startTimeSeconds,
      end_time_seconds: updated.endTimeSeconds,
      status: updated.status,
      dialogue_text: updated.dialogueText,
      updated_at: updated.updatedAt,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteScene = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, sceneId } = req.params;
    const userId = req.userId!;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const scene = await prisma.scene.findFirst({
      where: { id: sceneId, projectId },
    });

    if (!scene) {
      throw new AppError('Scene not found', 404);
    }

    await prisma.scene.delete({ where: { id: sceneId } });

    res.json({ message: 'Scene deleted successfully' });
  } catch (error) {
    throw error;
  }
};
