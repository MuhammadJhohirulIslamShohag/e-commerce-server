import { AnyZodObject, ZodEffects } from 'zod';
import { NextFunction, Request, Response } from 'express';

// router level validation request
const validateRequest = (
  zodSchema: AnyZodObject | ZodEffects<AnyZodObject>
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
   
    try {
      await zodSchema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
