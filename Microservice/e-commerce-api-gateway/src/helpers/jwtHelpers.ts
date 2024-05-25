import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

import ApiError from '../errors/ApiError';
import config from '../config';

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwt.secret)
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');
  }
};

export const jwtHelpers = {
  verifyToken,
};
