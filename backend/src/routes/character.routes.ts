import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createCharacters,
  getCharacters,
  updateCharacter,
  deleteCharacter,
} from '../controllers/character.controller';
import { validate } from '../middleware/validate';
import { createCharactersSchema } from '../validators/character.validator';

const router = Router();

router.post('/:id/characters', authenticate, validate(createCharactersSchema), createCharacters);
router.get('/:id/characters', authenticate, getCharacters);
router.put('/:projectId/characters/:characterId', authenticate, updateCharacter);
router.delete('/:projectId/characters/:characterId', authenticate, deleteCharacter);

export default router;
