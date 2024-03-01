import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';

import ApiError from '../errors/ApiError';
import config from '../config';

import { jwtHelpers } from '../helpers/jwt.helper';


const auth =
  (...requiredRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check authentication
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      // verify token
      let verifiedUser = null;
      verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );

      req.user = verifiedUser;

      // check authorization
      if (requiredRole.length && !requiredRole.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden user!');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
