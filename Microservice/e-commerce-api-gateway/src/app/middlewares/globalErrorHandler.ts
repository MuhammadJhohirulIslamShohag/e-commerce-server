/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import config from '../../config';
import { IGenericErrorMessage } from '../../interfaces/error';
import ApiError from '../../errors/ApiError';
import { errorLogger } from '../../shared/logger';
import { ZodError } from 'zod';
import handleZodValidationError from '../../errors/handleZodValidationError';
import { AxiosError } from 'axios';
import handleAxiosError from '../../errors/AxiosError';

// global error handler
const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  config.env === 'development'
    ? console.log(`global error handler~~~`, error)
    : errorLogger.error(`global error handler~~~`, error);

  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof ZodError) {
    const zodError = handleZodValidationError(error);
    statusCode = zodError?.statusCode;
    message = zodError?.message;
    errorMessages = zodError?.errorMessages;
  } else if (error instanceof AxiosError) {
    const axiosError = handleAxiosError(error);
    statusCode = axiosError?.statusCode;
    message = axiosError?.message;
    errorMessages = axiosError?.errorMessages;
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

  const responsePayload = {
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error.stack : undefined,
  };

  res.status(statusCode).json(responsePayload);
};

export default globalErrorHandler;
