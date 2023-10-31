/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import firebaseAdmin from '../../firebase';
import User from '../modules/user/user.model';

export const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.headers.token;
      if (!token) {
        new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized user!');
      }

      const firebaseUser = await firebaseAdmin
        .auth()
        .verifyIdToken(token as string);
        
      req.user = firebaseUser;

      // get verified user
      const verifiedUser = await User.findOne({
        email: firebaseUser.email,
      }).exec();

      // checking authorization
      if (
        requiredRoles.length &&
        !requiredRoles.includes(verifiedUser?.role as string)
      ) {
        new ApiError(httpStatus.FORBIDDEN, 'Forbidden user!');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
