import { Router } from 'express';
import { getVoiceStyles } from '../controllers/voice.controller';

const router = Router();

router.get('/', getVoiceStyles);

export default router;
