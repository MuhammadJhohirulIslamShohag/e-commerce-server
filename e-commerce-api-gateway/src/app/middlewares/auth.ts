import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { IAuthUser } from '../../interfaces/auth';

const auth =
  (...requiredRole: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      // check authentication
      const token = req.headers.authorization;
      if (!token) {
        return reject(
          new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
        );
      }

      // verify token
      const verifiedUser: IAuthUser = jwtHelpers.verifyToken(token);

      req.user = verifiedUser;

      // check authorization
      if (requiredRole.length && !requiredRole.includes(verifiedUser.role)) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden user!'));
      }
      resolve(verifiedUser);
    })
      .then(() => next())
      .catch(() => next());
  };

export default auth;
