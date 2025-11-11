import { Response, Request } from 'express';
import { prisma } from '../utils/prisma';

export const getVoiceStyles = async (req: Request, res: Response) => {
  try {
    const voiceStyles = await prisma.voiceStyle.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({
      voice_styles: voiceStyles.map(vs => ({
        voice_style_id: vs.id,
        name: vs.name,
        language: vs.language,
        accent: vs.accent,
        description: vs.description,
        sample_url: vs.sampleUrl,
        created_at: vs.createdAt,
        updated_at: vs.updatedAt,
      })),
    });
  } catch (error) {
    throw error;
  }
};
