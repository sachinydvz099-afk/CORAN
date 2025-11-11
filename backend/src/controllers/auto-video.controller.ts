import { Response } from 'express';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { Project } from '../models/Project';
import { Scene } from '../models/Scene';
import { Character } from '../models/Character';
import { logger } from '../utils/logger';
import { processSceneGeneration, processFinalVideoRender } from '../services/render.service';

/**
 * Automatically generates a complete animated video from a script
 * Handles the entire workflow: script analysis → character generation → scene breakdown → video rendering
 */
export const generateFullVideo = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      title, 
      description, 
      script_text, 
      target_length_minutes = 40,
      style = '2D_flat' 
    } = req.body;
    const userId = req.userId!;

    // Validate input
    if (!script_text || script_text.length < 100) {
      throw new AppError('Script text must be at least 100 characters', 400);
    }

    if (target_length_minutes < 1 || target_length_minutes > 120) {
      throw new AppError('Target length must be between 1 and 120 minutes', 400);
    }

    logger.info('Starting automatic video generation', {
      userId,
      scriptLength: script_text.length,
      targetLength: target_length_minutes
    });

    // Create project
    const project = await Project.create({
      userId,
      title: title || 'AI Generated Video',
      description: description || 'Automatically generated from script',
      promptText: script_text,
      targetLengthMinutes: target_length_minutes,
      style,
      status: 'processing',
    });

    // Return immediately with project ID, processing will continue in background
    res.status(202).json({
      message: 'Video generation started. This may take 10-30 minutes depending on length.',
      project_id: project._id,
      status: 'processing',
      estimated_time_minutes: Math.max(10, target_length_minutes / 4),
      workflow: {
        step1: 'Analyzing script with AI',
        step2: 'Generating characters',
        step3: 'Breaking down into scenes',
        step4: 'Rendering each scene',
        step5: 'Assembling final video'
      }
    });

    // Process asynchronously
    processVideoGeneration(project._id.toString()).catch(error => {
      logger.error(`Failed to generate video for project ${project._id}:`, error);
      Project.findByIdAndUpdate(project._id, { status: 'failed' });
    });

  } catch (error) {
    throw error;
  }
};

/**
 * Background process to generate the complete video
 */
async function processVideoGeneration(projectId: string) {
  try {
    logger.info(`Background processing started for project: ${projectId}`);

    // Step 1 & 2: Analyze script and generate characters/scenes
    await processSceneGeneration(projectId, {});

    // Step 3: Render all scenes
    const scenes = await Scene.find({ projectId });
    logger.info(`Rendering ${scenes.length} scenes for project ${projectId}`);

    for (const scene of scenes) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
        // Scene rendering happens in processSceneGeneration
        logger.info(`Scene ${scene.sceneNumber}/${scenes.length} ready`);
      } catch (sceneError: any) {
        logger.error(`Failed to render scene ${scene.sceneNumber}:`, sceneError.message);
        // Continue with other scenes
      }
    }

    // Step 4: Generate final video
    logger.info(`Assembling final video for project ${projectId}`);
    await processFinalVideoRender({ projectId, payload: {} });

    logger.info(`Video generation complete for project ${projectId}`);
  } catch (error: any) {
    logger.error(`Error in background video generation:`, error.message);
    await Project.findByIdAndUpdate(projectId, { status: 'failed' });
    throw error;
  }
}

/**
 * Get video generation status
 */
export const getVideoStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const project = await Project.findOne({ _id: id, userId });
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const characters = await Character.find({ projectId: id });
    const scenes = await Scene.find({ projectId: id }).sort({ sceneNumber: 1 });
    
    const completedScenes = scenes.filter(s => s.status === 'completed').length;
    const totalScenes = scenes.length;
    
    let progress = 0;
    if (project.status === 'draft') progress = 0;
    else if (project.status === 'processing' && totalScenes === 0) progress = 20;
    else if (project.status === 'processing' && totalScenes > 0) {
      progress = 20 + (completedScenes / totalScenes) * 60;
    }
    else if (project.status === 'completed') progress = 100;

    const finalVideoUrl = project.metadata?.finalVideoUrl || null;

    res.json({
      project_id: project._id,
      title: project.title,
      status: project.status,
      progress: Math.round(progress),
      character_count: characters.length,
      scene_count: totalScenes,
      completed_scenes: completedScenes,
      target_length_minutes: project.targetLengthMinutes,
      final_video_url: finalVideoUrl,
      created_at: project.createdAt,
      completed_at: project.completedAt,
      characters: characters.map(c => ({
        name: c.name,
        role: c.role,
        image_url: c.imageUrl
      })),
      scenes: scenes.map(s => ({
        scene_number: s.sceneNumber,
        title: s.title,
        duration: s.endTimeSeconds - s.startTimeSeconds,
        status: s.status
      }))
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Preview a specific scene
 */
export const previewScene = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, sceneNumber } = req.params;
    const userId = req.userId!;

    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const scene = await Scene.findOne({ 
      projectId, 
      sceneNumber: parseInt(sceneNumber) 
    });

    if (!scene) {
      throw new AppError('Scene not found', 404);
    }

    const dialogue = scene.dialogueText ? JSON.parse(scene.dialogueText) : [];
    const metadata = scene.metadata || {};

    res.json({
      scene_number: scene.sceneNumber,
      title: scene.title,
      description: scene.description,
      duration: scene.endTimeSeconds - scene.startTimeSeconds,
      start_time: scene.startTimeSeconds,
      end_time: scene.endTimeSeconds,
      status: scene.status,
      storyboard_url: scene.storyboardUrl,
      dialogue,
      visual_elements: metadata.visualElements,
      background_music: metadata.backgroundMusic,
      camera_angles: metadata.cameraAngles,
      background_url: metadata.backgroundUrl,
      audio_url: metadata.audioUrl
    });
  } catch (error) {
    throw error;
  }
};
