import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getScenes,
  updateScene,
  deleteScene,
} from '../controllers/scene.controller';

const router = Router();

router.get('/:id/scenes', authenticate, getScenes);
router.put('/:projectId/scenes/:sceneId', authenticate, updateScene);
router.delete('/:projectId/scenes/:sceneId', authenticate, deleteScene);

export default router;
