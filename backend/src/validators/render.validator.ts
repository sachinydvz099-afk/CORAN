import Joi from 'joi';

export const createRenderJobSchema = Joi.object({
  render_type: Joi.string().valid('final_video', 'scene_render').required(),
  resolution: Joi.string().valid('720p', '1080p', '4k').default('1080p'),
  output_format: Joi.string().valid('mp4', 'mov', 'webm').default('mp4'),
  notify_on_complete: Joi.boolean().default(true),
  scene_id: Joi.string().uuid().when('render_type', {
    is: 'scene_render',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});
