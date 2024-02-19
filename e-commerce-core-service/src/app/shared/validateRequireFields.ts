import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';

export const validateRequireFields = async (
  properties: Record<string, unknown>,
  requiredFields: string[]
) => {
  Object.keys(properties).map(property => {
    if (!requiredFields.includes(property)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `${property?.[0].toUpperCase() + property?.slice(1)} Is Required!`
      );
    }
  });

  for (const property in properties) {
    if (!property) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Please provide values on ${property} property`
      );
    }
  }
};
