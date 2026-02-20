import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const productIdSchema = Joi.object({
  productId: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .pattern(/^[A-Za-z0-9_-]+$/)
    .required()
    .messages({
      'string.base': 'productId must be a string.',
      'string.empty': 'productId cannot be empty.',
      'string.min': 'productId must have at least 1 character.',
      'string.max': 'productId must have at most 100 characters.',
      'string.pattern.base': 'productId must contain only alphanumeric characters, hyphens or underscores.',
      'any.required': 'productId is required.',
    }),
});

// eslint-disable-next-line import/prefer-default-export
export const validateProductId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { error } = productIdSchema.validate(req.params);

  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  next();
};
