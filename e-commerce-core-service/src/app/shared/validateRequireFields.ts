import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';

export const validateRequireFields = (properties: Record<string, unknown>) => {
  for (const property in properties) {
    if (!property) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Please provide values on ${property} property`
      );
    }
  }
};
