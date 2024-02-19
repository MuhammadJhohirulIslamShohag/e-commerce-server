import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';

export const validateRequireFields = async (
  properties: Record<string, unknown>
) => {

  for (const property in properties) {
    if (!properties[property]) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Please provide values on ${property} property`
      );
    }
  }
};
