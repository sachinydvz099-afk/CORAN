import axios from 'axios';
import { logger } from '../utils/logger';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface ScriptAnalysis {
  characters: Array<{
    name: string;
    role: string;
    personality: string;
    appearance: string;
    voiceType: string;
  }>;
  scenes: Array<{
    sceneNumber: number;
    title: string;
    description: string;
    duration: number; // in seconds
    dialogue: Array<{
      character: string;
      text: string;
      emotion: string;
    }>;
    visualElements: string[];
    backgroundMusic: string;
    cameraAngles: string[];
  }>;
  totalDuration: number;
  theme: string;
  mood: string;
}

/**
 * Analyzes a script using AI to extract characters, scenes, and generate detailed video instructions
 * Designed to handle long-form content (40+ minutes)
 */
export async function analyzeScript(
  scriptText: string, 
  targetLengthMinutes: number,
  style: string
): Promise<ScriptAnalysis> {
  try {
    logger.info('Analyzing script with AI', { 
      scriptLength: scriptText.length, 
      targetLength: targetLengthMinutes 
    });

    const targetSeconds = targetLengthMinutes * 60;

    const prompt = `You are an expert AI script analyzer and video production assistant. Analyze the following script and create a detailed breakdown for a ${targetLengthMinutes}-minute animated video in ${style} style.

Script:
"""
${scriptText}
"""

Your task:
1. Identify all main characters with detailed descriptions
2. Break the script into scenes that total approximately ${targetSeconds} seconds (${targetLengthMinutes} minutes)
3. For each scene, provide:
   - Scene number and title
   - Detailed description
   - Duration in seconds (ensure total adds up to ${targetSeconds} seconds)
   - Complete dialogue with character names and emotions
   - Visual elements needed
   - Background music suggestions
   - Camera angles and shots

4. Ensure the pacing is appropriate for a ${targetLengthMinutes}-minute video
5. Each scene should be 30-120 seconds long
6. Include transitions between scenes

Respond ONLY with valid JSON in this exact format:
{
  "theme": "overall theme",
  "mood": "overall mood",
  "totalDuration": ${targetSeconds},
  "characters": [
    {
      "name": "Character Name",
      "role": "protagonist/antagonist/supporting",
      "personality": "brief personality description",
      "appearance": "detailed visual description for ${style} style",
      "voiceType": "voice characteristics (deep/high/soft/energetic/etc)"
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Scene Title",
      "description": "What happens in this scene",
      "duration": 45,
      "dialogue": [
        {
          "character": "Character Name",
          "text": "What they say",
          "emotion": "happy/sad/angry/neutral/excited/etc"
        }
      ],
      "visualElements": ["element1", "element2"],
      "backgroundMusic": "music mood/type",
      "cameraAngles": ["wide shot", "close up", "etc"]
    }
  ]
}`;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert video production AI that outputs only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const content = response.data.choices[0].message.content;
    const analysis: ScriptAnalysis = JSON.parse(content);

    logger.info('Script analysis complete', {
      characterCount: analysis.characters.length,
      sceneCount: analysis.scenes.length,
      totalDuration: analysis.totalDuration
    });

    return analysis;
  } catch (error: any) {
    logger.error('Failed to analyze script:', error.message);
    
    // Fallback: Create basic analysis
    return createFallbackAnalysis(scriptText, targetLengthMinutes, style);
  }
}

/**
 * Creates a basic fallback analysis when AI service fails
 */
function createFallbackAnalysis(
  scriptText: string, 
  targetLengthMinutes: number,
  style: string
): ScriptAnalysis {
  const targetSeconds = targetLengthMinutes * 60;
  const sceneCount = Math.max(Math.floor(targetLengthMinutes / 2), 5); // At least 5 scenes
  const sceneDuration = Math.floor(targetSeconds / sceneCount);

  const words = scriptText.split(/\s+/);
  const wordsPerScene = Math.floor(words.length / sceneCount);

  const scenes = Array.from({ length: sceneCount }, (_, i) => ({
    sceneNumber: i + 1,
    title: `Scene ${i + 1}`,
    description: words.slice(i * wordsPerScene, (i + 1) * wordsPerScene).join(' ').substring(0, 200),
    duration: sceneDuration,
    dialogue: [
      {
        character: 'Narrator',
        text: words.slice(i * wordsPerScene, (i + 1) * wordsPerScene).join(' ').substring(0, 300),
        emotion: 'neutral'
      }
    ],
    visualElements: ['Background scene', 'Character animation'],
    backgroundMusic: 'ambient',
    cameraAngles: ['medium shot']
  }));

  return {
    theme: 'Story',
    mood: 'narrative',
    totalDuration: targetSeconds,
    characters: [
      {
        name: 'Narrator',
        role: 'narrator',
        personality: 'Storytelling',
        appearance: 'Professional presenter',
        voiceType: 'clear and articulate'
      }
    ],
    scenes
  };
}

/**
 * Extends a script analysis to reach target duration
 */
export async function extendScriptAnalysis(
  currentAnalysis: ScriptAnalysis,
  additionalContent: string,
  targetLengthMinutes: number
): Promise<ScriptAnalysis> {
  try {
    const currentDuration = currentAnalysis.totalDuration;
    const targetDuration = targetLengthMinutes * 60;
    const additionalDuration = targetDuration - currentDuration;

    if (additionalDuration <= 0) {
      return currentAnalysis;
    }

    logger.info('Extending script analysis', {
      currentDuration,
      targetDuration,
      additionalDuration
    });

    const newScenes = await analyzeScript(additionalContent, additionalDuration / 60, 'continuation');
    
    // Merge scenes
    const maxSceneNumber = Math.max(...currentAnalysis.scenes.map(s => s.sceneNumber));
    const extendedScenes = newScenes.scenes.map(scene => ({
      ...scene,
      sceneNumber: maxSceneNumber + scene.sceneNumber
    }));

    return {
      ...currentAnalysis,
      characters: [...currentAnalysis.characters, ...newScenes.characters.filter(
        nc => !currentAnalysis.characters.some(c => c.name === nc.name)
      )],
      scenes: [...currentAnalysis.scenes, ...extendedScenes],
      totalDuration: currentDuration + newScenes.totalDuration
    };
  } catch (error: any) {
    logger.error('Failed to extend script analysis:', error.message);
    return currentAnalysis;
  }
}
