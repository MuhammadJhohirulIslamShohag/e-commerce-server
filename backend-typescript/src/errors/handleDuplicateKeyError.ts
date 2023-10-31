import { MongoServerError } from 'mongodb';
import { IGenericErrorMessage } from '../interfaces/error';
import { IGenericErrorResponse } from '../interfaces/common';
import httpStatus from 'http-status';

const handleDuplicateKeyError = (
  error: MongoServerError
): IGenericErrorResponse => {
  let errors: IGenericErrorMessage[] = [];

  if (error.code === 11000 && error.keyPattern) {
    errors = [
      {
        path: Object.keys(error?.keyPattern)[0],
        message: error?.message,
      },
    ];
  }

  const statusCode = httpStatus.CONFLICT;
  return {
    statusCode,
    message: 'Duplicate Key Error',
    errorMessages: errors,
  };
};

export default handleDuplicateKeyError;
