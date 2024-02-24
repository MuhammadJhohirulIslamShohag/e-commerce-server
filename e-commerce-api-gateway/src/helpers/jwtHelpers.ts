/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';
import config from '../config';

const verifyToken = (token: string) => {
  try {
    const isVerified = jwt.verify(token, config.jwt.secret);
    return isVerified as any;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Token');
  }
};

export const jwtHelpers = {
  verifyToken,
};
