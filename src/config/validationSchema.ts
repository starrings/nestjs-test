import * as Joi from 'joi';

export const validationSchema = Joi.object({
  EMAIL_SERVICE: Joi.string(),
  EMAIL_AUTH_USER: Joi.string(),
  EMAIL_AUTH_PASSWORD: Joi.string(),
  EMAIL_BASE_URL: Joi.string().uri(),
});
