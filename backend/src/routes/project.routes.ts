import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { validate } from '../middleware/validate';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';

const router = Router();

router.post('/', authenticate, validate(createProjectSchema), createProject);
router.get('/', authenticate, getProjects);
router.get('/:id', authenticate, getProjectById);
router.put('/:id', authenticate, validate(updateProjectSchema), updateProject);
router.delete('/:id', authenticate, deleteProject);

export default router;
