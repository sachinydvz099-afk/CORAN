import axios from 'axios';
import { logger } from '../utils/logger';
import { prisma } from '../utils/prisma';

const AI_SCENE_SERVICE_URL = process.env.AI_SCENE_SERVICE_URL || 'http://localhost:5001';
const AI_RENDER_SERVICE_URL = process.env.AI_RENDER_SERVICE_URL || 'http://localhost:5003';

export async function processSceneGeneration(projectId: string, data: any) {
  try {
    logger.info(`Generating scenes for project: ${projectId}`);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Call AI Scene Service to analyze prompt and generate scenes
    const response = await axios.post(`${AI_SCENE_SERVICE_URL}/generate-scenes`, {
      prompt: project.promptText,
      target_length_minutes: project.targetLengthMinutes,
      style: project.style,
    }, {
      timeout: 120000, // 2 minutes
    });

    if (!response.data || !Array.isArray(response.data.scenes)) {
      throw new Error('Invalid response from AI Scene Service');
    }

    // Create scenes in database
    const scenes = await Promise.all(
      response.data.scenes.map((scene: any, index: number) =>
        prisma.scene.create({
          data: {
            projectId,
            sceneNumber: index + 1,
            title: scene.title,
            startTimeSeconds: scene.start_time_seconds,
            endTimeSeconds: scene.end_time_seconds,
            status: 'pending',
            storyboardUrl: scene.storyboard_url || null,
            dialogueText: scene.dialogue_text || null,
          },
        })
      )
    );

    logger.info(`Generated ${scenes.length} scenes for project: ${projectId}`);
    return scenes;
  } catch (error: any) {
    logger.error(`Failed to generate scenes for project ${projectId}:`, error.message);
    throw error;
  }
}

export async function processSceneRender(data: any): Promise<string> {
  try {
    const { projectId, payload } = data;
    const sceneId = payload?.scene_id;

    logger.info(`Rendering scene: ${sceneId} for project: ${projectId}`);

    const scene = await prisma.scene.findUnique({
      where: { id: sceneId },
      include: {
        project: true,
        sceneCharacters: {
          include: {
            character: {
              include: {
                voiceStyle: true,
              },
            },
          },
        },
      },
    });

    if (!scene) {
      throw new Error('Scene not found');
    }

    // Call AI Render Service
    const response = await axios.post(`${AI_RENDER_SERVICE_URL}/render-scene`, {
      scene_id: sceneId,
      scene_number: scene.sceneNumber,
      title: scene.title,
      duration: scene.endTimeSeconds - scene.startTimeSeconds,
      dialogue: scene.dialogueText,
      characters: scene.sceneCharacters.map(sc => ({
        name: sc.character.name,
        role: sc.character.role,
        image_url: sc.character.imageUrl,
        voice_style: sc.character.voiceStyle,
      })),
      style: scene.project.style,
      resolution: payload?.resolution || '1080p',
      output_format: payload?.output_format || 'mp4',
    }, {
      timeout: 600000, // 10 minutes for scene rendering
    });

    if (!response.data || !response.data.output_url) {
      throw new Error('Invalid response from AI Render Service');
    }

    // Update scene status
    await prisma.scene.update({
      where: { id: sceneId },
      data: { status: 'completed' },
    });

    logger.info(`Completed scene render: ${sceneId}`);
    return response.data.output_url;
  } catch (error: any) {
    logger.error('Failed to render scene:', error.message);
    throw error;
  }
}

export async function processFinalVideoRender(data: any): Promise<string> {
  try {
    const { projectId, payload } = data;

    logger.info(`Rendering final video for project: ${projectId}`);

    // Get all completed scenes
    const scenes = await prisma.scene.findMany({
      where: { projectId },
      orderBy: { sceneNumber: 'asc' },
    });

    // First, ensure all scenes are rendered
    const renderJobs = await prisma.renderJob.findMany({
      where: {
        projectId,
        jobType: 'scene_render',
        status: 'success',
      },
    });

    if (renderJobs.length !== scenes.length) {
      throw new Error('Not all scenes have been rendered');
    }

    const sceneUrls = renderJobs
      .sort((a, b) => {
        const sceneA = scenes.find(s => (a.payload as any)?.scene_id === s.id);
        const sceneB = scenes.find(s => (b.payload as any)?.scene_id === s.id);
        return (sceneA?.sceneNumber || 0) - (sceneB?.sceneNumber || 0);
      })
      .map(job => job.outputUrl);

    // Call AI Render Service to stitch scenes together
    const response = await axios.post(`${AI_RENDER_SERVICE_URL}/stitch-video`, {
      project_id: projectId,
      scene_urls: sceneUrls,
      resolution: payload?.resolution || '1080p',
      output_format: payload?.output_format || 'mp4',
    }, {
      timeout: 1800000, // 30 minutes for final video
    });

    if (!response.data || !response.data.output_url) {
      throw new Error('Invalid response from AI Render Service');
    }

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        thumbnailUrl: response.data.thumbnail_url,
      },
    });

    // Send notification to user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (project) {
      await prisma.notification.create({
        data: {
          userId: project.userId,
          type: 'render_complete',
          payload: {
            project_id: projectId,
            project_title: project.title,
            output_url: response.data.output_url,
          },
          isRead: false,
        },
      });
    }

    logger.info(`Completed final video render for project: ${projectId}`);
    return response.data.output_url;
  } catch (error: any) {
    logger.error('Failed to render final video:', error.message);
    throw error;
  }
}
