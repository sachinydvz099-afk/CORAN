import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getCredits } from '../controllers/billing.controller';

const router = Router();

router.get('/credits', authenticate, getCredits);

export default router;
