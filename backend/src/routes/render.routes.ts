import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createRenderJob,
  getRenderJobStatus,
} from '../controllers/render.controller';
import { validate } from '../middleware/validate';
import { createRenderJobSchema } from '../validators/render.validator';

const router = Router();

router.post('/projects/:id/render', authenticate, validate(createRenderJobSchema), createRenderJob);
router.get('/render_jobs/:jobId/status', authenticate, getRenderJobStatus);

export default router;
