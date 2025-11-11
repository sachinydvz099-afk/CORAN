import Joi from 'joi';

export const createCharactersSchema = Joi.object({
  actions: Joi.array().items(
    Joi.object({
      role: Joi.string().required(),
      name: Joi.string().required(),
      image_choice: Joi.string().valid('generated', 'upload').required(),
      metadata: Joi.object().optional(),
      voice_style_id: Joi.string().uuid().optional(),
    })
  ).min(1).required(),
});
