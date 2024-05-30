/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import config from '../config';
import ApiError from '../errors/ApiError';
import handleZodValidationError from '../errors/handleZodValidationError';
import handleCastError from '../errors/handleCastError';
import handleValidationError from '../errors/handleValidationError';

import { IGenericErrorMessage } from '../interfaces/error';
// import { errorLogger } from '../shared/logger';

// global error handler
const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // config.env === 'development'
  //   ? console.log(`global error handler~~~`, error)
  //   : console.log(`global error handler~~~`, error);

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    // handle validation error
    const simpliFiedError = handleValidationError(error);
    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorMessages = simpliFiedError?.errorMessages;
  } else if (error?.name === 'CastError') {
    // handle cast error
    const simpliFiedError = handleCastError(error);
    statusCode = simpliFiedError?.statusCode;
    message = simpliFiedError?.message;
    errorMessages = simpliFiedError?.errorMessages;
  } else if (error instanceof ZodError) {
    const zodError = handleZodValidationError(error); // handle zod validation error
    statusCode = zodError?.statusCode;
    message = zodError?.message;
    errorMessages = zodError?.errorMessages;
  } else if (error instanceof ApiError) {
    // handle custom error
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env === 'development' ? error.stack : undefined,
  });
  next(new ApiError(statusCode, message));
};

export default globalErrorHandler;
