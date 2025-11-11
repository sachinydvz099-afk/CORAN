import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { generateCharacterImage } from '../services/ai-character.service';

export const createCharacters = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { actions } = req.body;
    const userId = req.userId!;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Generate characters
    const characters = await Promise.all(
      actions.map(async (action: any) => {
        let imageUrl = null;
        
        if (action.image_choice === 'generated') {
          // Call AI service to generate character image
          imageUrl = await generateCharacterImage({
            name: action.name,
            role: action.role,
            style: project.style,
            metadata: action.metadata,
          });
        }

        return prisma.character.create({
          data: {
            projectId: id,
            name: action.name,
            role: action.role,
            imageUrl,
            imageMetadata: action.metadata || {},
            voiceStyleId: action.voice_style_id || null,
          },
        });
      })
    );

    res.json({
      characters: characters.map(c => ({
        character_id: c.id,
        project_id: c.projectId,
        name: c.name,
        role: c.role,
        image_url: c.imageUrl,
        image_metadata: c.imageMetadata,
        voice_style_id: c.voiceStyleId,
        created_at: c.createdAt,
        updated_at: c.updatedAt,
      })),
    });
  } catch (error) {
    throw error;
  }
};

export const getCharacters = async (req: AuthRequest, res: Response) => {
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

    const characters = await prisma.character.findMany({
      where: { projectId: id },
      include: { voiceStyle: true },
    });

    res.json({
      characters: characters.map(c => ({
        character_id: c.id,
        project_id: c.projectId,
        name: c.name,
        role: c.role,
        image_url: c.imageUrl,
        image_metadata: c.imageMetadata,
        voice_style_id: c.voiceStyleId,
        voice_style: c.voiceStyle,
        created_at: c.createdAt,
        updated_at: c.updatedAt,
      })),
    });
  } catch (error) {
    throw error;
  }
};

export const updateCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, characterId } = req.params;
    const userId = req.userId!;
    const updates = req.body;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const character = await prisma.character.findFirst({
      where: { id: characterId, projectId },
    });

    if (!character) {
      throw new AppError('Character not found', 404);
    }

    const updated = await prisma.character.update({
      where: { id: characterId },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.role && { role: updates.role }),
        ...(updates.image_url && { imageUrl: updates.image_url }),
        ...(updates.image_metadata && { imageMetadata: updates.image_metadata }),
        ...(updates.voice_style_id !== undefined && { voiceStyleId: updates.voice_style_id }),
      },
    });

    res.json({
      character_id: updated.id,
      project_id: updated.projectId,
      name: updated.name,
      role: updated.role,
      image_url: updated.imageUrl,
      image_metadata: updated.imageMetadata,
      voice_style_id: updated.voiceStyleId,
      updated_at: updated.updatedAt,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, characterId } = req.params;
    const userId = req.userId!;

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const character = await prisma.character.findFirst({
      where: { id: characterId, projectId },
    });

    if (!character) {
      throw new AppError('Character not found', 404);
    }

    await prisma.character.delete({ where: { id: characterId } });

    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    throw error;
  }
};
