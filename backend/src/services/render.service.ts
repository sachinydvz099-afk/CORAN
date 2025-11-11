import axios from 'axios';
import { logger } from '../utils/logger';
import { prisma } from '../utils/prisma';
import { Project } from '../models/Project';
import { Character } from '../models/Character';
import { Scene } from '../models/Scene';
import { analyzeScript } from './ai-script-analyzer.service';
import { 
  generateCharacterVisual, 
  generateCompleteVideo,
  generateVoiceAudio,
  generateSceneBackground
} from './ai-video-generator.service';

const AI_SCENE_SERVICE_URL = process.env.AI_SCENE_SERVICE_URL || 'http://localhost:5001';
const AI_RENDER_SERVICE_URL = process.env.AI_RENDER_SERVICE_URL || 'http://localhost:5003';

export async function processSceneGeneration(projectId: string, data: any) {
  try {
    logger.info(`Generating scenes for project: ${projectId}`);

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    // Use AI to analyze the script and generate intelligent scene breakdown
    logger.info('Using AI to analyze script and generate scenes');
    const scriptAnalysis = await analyzeScript(
      project.promptText,
      project.targetLengthMinutes,
      project.style
    );

    // Generate characters from analysis
    logger.info(`Creating ${scriptAnalysis.characters.length} characters`);
    const characterMap = new Map();
    
    for (const char of scriptAnalysis.characters) {
      // Generate character visual
      const imageUrl = await generateCharacterVisual(
        char.name,
        char.appearance,
        project.style
      );

      const character = await Character.create({
        projectId,
        name: char.name,
        role: char.role,
        imageUrl,
        metadata: {
          personality: char.personality,
          appearance: char.appearance,
          voiceType: char.voiceType
        }
      });

      characterMap.set(char.name, character._id);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Create scenes in database with full details
    logger.info(`Creating ${scriptAnalysis.scenes.length} scenes`);
    const scenes = [];
    let cumulativeTime = 0;

    for (const sceneData of scriptAnalysis.scenes) {
      const scene = await Scene.create({
        projectId,
        sceneNumber: sceneData.sceneNumber,
        title: sceneData.title,
        description: sceneData.description,
        startTimeSeconds: cumulativeTime,
        endTimeSeconds: cumulativeTime + sceneData.duration,
        status: 'pending',
        dialogueText: JSON.stringify(sceneData.dialogue),
        metadata: {
          visualElements: sceneData.visualElements,
          backgroundMusic: sceneData.backgroundMusic,
          cameraAngles: sceneData.cameraAngles,
          characters: sceneData.dialogue.map(d => d.character)
        }
      });

      scenes.push(scene);
      cumulativeTime += sceneData.duration;
    }

    // Update project with theme and mood
    await Project.findByIdAndUpdate(projectId, {
      metadata: {
        theme: scriptAnalysis.theme,
        mood: scriptAnalysis.mood,
        totalDuration: scriptAnalysis.totalDuration
      }
    });

    logger.info(`Generated ${scenes.length} scenes and ${scriptAnalysis.characters.length} characters for project: ${projectId}`);
    return { scenes, characters: scriptAnalysis.characters };
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

    const scene = await Scene.findById(sceneId);
    if (!scene) {
      throw new Error('Scene not found');
    }

    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Parse dialogue from scene
    const dialogue = scene.dialogueText ? JSON.parse(scene.dialogueText) : [];
    const metadata = scene.metadata || {};

    // Get characters for this scene
    const characterNames = metadata.characters || [];
    const characters = await Character.find({ 
      projectId,
      name: { $in: characterNames }
    });

    // Generate scene background
    logger.info('Generating scene background');
    const backgroundUrl = await generateSceneBackground(
      scene.description || scene.title,
      project.style,
      metadata.visualElements || []
    );

    // Generate audio for all dialogue
    logger.info('Generating voice audio');
    const fullDialogue = dialogue.map((d: any) => d.text).join(' ');
    const primaryCharacter = characters.find((c: any) => 
      c.name === (dialogue[0]?.character || '')
    );
    
    const audioUrl = fullDialogue ? await generateVoiceAudio(
      fullDialogue,
      primaryCharacter?.metadata?.voiceType || 'clear and articulate',
      dialogue[0]?.emotion || 'neutral'
    ) : '';

    // Update scene with generated assets
    await Scene.findByIdAndUpdate(sceneId, {
      storyboardUrl: backgroundUrl,
      status: 'completed',
      metadata: {
        ...metadata,
        backgroundUrl,
        audioUrl
      }
    });

    logger.info(`Completed scene render: ${sceneId}`);
    return backgroundUrl;
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
    const scenes = await Scene.find({ projectId }).sort({ sceneNumber: 1 });
    const project = await Project.findById(projectId);
    
    if (!project) {
      throw new Error('Project not found');
    }

    // Get all characters
    const characters = await Character.find({ projectId });

    // Prepare scene data for video generation
    const sceneData = scenes.map(scene => {
      const metadata = scene.metadata || {};
      const dialogue = scene.dialogueText ? JSON.parse(scene.dialogueText) : [];
      
      return {
        sceneNumber: scene.sceneNumber,
        description: scene.description || scene.title,
        duration: scene.endTimeSeconds - scene.startTimeSeconds,
        dialogue,
        visualElements: metadata.visualElements || [],
        cameraAngles: metadata.cameraAngles || ['medium shot']
      };
    });

    const characterVisuals = characters.map((char: any) => ({
      characterId: char._id.toString(),
      name: char.name,
      imageUrl: char.imageUrl || '',
      style: project.style
    }));

    // Generate complete video using AI
    logger.info('Generating complete animated video...');
    const { sceneVideos, finalVideoUrl } = await generateCompleteVideo(
      characterVisuals,
      sceneData,
      project.style
    );

    // Update project status
    await Project.findByIdAndUpdate(projectId, {
      status: 'completed',
      completedAt: new Date(),
      metadata: {
        ...project.metadata,
        finalVideoUrl,
        sceneVideos: sceneVideos.map(sv => ({
          sceneId: sv.sceneId,
          videoUrl: sv.videoUrl,
          duration: sv.duration
        }))
      }
    });

    logger.info(`Completed final video render for project: ${projectId}`);
    return finalVideoUrl;
  } catch (error: any) {
    logger.error('Failed to render final video:', error.message);
    throw error;
  }
}
