import axios from 'axios';
import { logger } from '../utils/logger';

const AI_CHARACTER_SERVICE_URL = process.env.AI_CHARACTER_SERVICE_URL || 'http://localhost:5000';

interface CharacterImageRequest {
  name: string;
  role: string;
  style: string;
  metadata?: any;
}

export async function generateCharacterImage(params: CharacterImageRequest): Promise<string> {
  try {
    logger.info('Generating character image', params);

    // Call AI Character Service
    const response = await axios.post(`${AI_CHARACTER_SERVICE_URL}/generate`, {
      character_name: params.name,
      character_role: params.role,
      animation_style: params.style,
      metadata: params.metadata,
    }, {
      timeout: 60000, // 60 seconds
    });

    if (response.data && response.data.image_url) {
      logger.info(`Generated character image: ${response.data.image_url}`);
      return response.data.image_url;
    }

    throw new Error('Invalid response from AI Character Service');
  } catch (error: any) {
    logger.error('Failed to generate character image:', error.message);
    
    // Return a placeholder image URL in case of failure
    const placeholderUrl = `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(params.name)}`;
    logger.warn(`Using placeholder image: ${placeholderUrl}`);
    
    return placeholderUrl;
  }
}

export async function generateCharacterBatch(characters: CharacterImageRequest[]): Promise<string[]> {
  try {
    const response = await axios.post(`${AI_CHARACTER_SERVICE_URL}/batch-generate`, {
      characters,
    }, {
      timeout: 120000, // 2 minutes
    });

    if (response.data && Array.isArray(response.data.image_urls)) {
      return response.data.image_urls;
    }

    throw new Error('Invalid response from AI Character Service');
  } catch (error: any) {
    logger.error('Failed to batch generate character images:', error.message);
    
    // Return placeholder images
    return characters.map(c => 
      `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(c.name)}`
    );
  }
}
