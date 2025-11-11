import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { 
  generateFullVideo, 
  getVideoStatus,
  previewScene
} from '../controllers/auto-video.controller';

const router = Router();

/**
 * @route   POST /api/auto-video/generate
 * @desc    Automatically generate a complete animated video from script
 * @access  Private
 * @body    {
 *            title: string,
 *            description?: string,
 *            script_text: string (min 100 chars),
 *            target_length_minutes?: number (default 40, max 120),
 *            style?: string (default '2D_flat')
 *          }
 * @returns {
 *            message: string,
 *            project_id: string,
 *            status: 'processing',
 *            estimated_time_minutes: number,
 *            workflow: object
 *          }
 */
router.post('/generate', authenticate, asyncHandler(generateFullVideo));

/**
 * @route   GET /api/auto-video/status/:id
 * @desc    Get video generation status and progress
 * @access  Private
 * @returns {
 *            project_id: string,
 *            status: string,
 *            progress: number (0-100),
 *            character_count: number,
 *            scene_count: number,
 *            completed_scenes: number,
 *            final_video_url: string | null,
 *            characters: array,
 *            scenes: array
 *          }
 */
router.get('/status/:id', authenticate, asyncHandler(getVideoStatus));

/**
 * @route   GET /api/auto-video/preview/:projectId/:sceneNumber
 * @desc    Preview a specific scene with all details
 * @access  Private
 * @returns {
 *            scene_number: number,
 *            title: string,
 *            description: string,
 *            duration: number,
 *            dialogue: array,
 *            visual_elements: array,
 *            storyboard_url: string,
 *            audio_url: string
 *          }
 */
router.get('/preview/:projectId/:sceneNumber', authenticate, asyncHandler(previewScene));

export default router;
