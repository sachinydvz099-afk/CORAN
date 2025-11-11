import Joi from 'joi';

export const createProjectSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(1000).optional(),
  prompt_text: Joi.string().min(10).required(),
  target_length_minutes: Joi.number().min(1).max(120).required(),
  style: Joi.string().valid('2D_flat', '3D', 'anime', 'cartoon', 'realistic').required(),
});

export const updateProjectSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(1000).optional(),
  prompt_text: Joi.string().min(10).optional(),
  target_length_minutes: Joi.number().min(1).max(120).optional(),
  style: Joi.string().valid('2D_flat', '3D', 'anime', 'cartoon', 'realistic').optional(),
  status: Joi.string().valid('draft', 'processing', 'completed', 'failed').optional(),
});
