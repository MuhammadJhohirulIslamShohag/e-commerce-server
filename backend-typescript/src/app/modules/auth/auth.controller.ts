import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';
import { AuthService } from './auth.service';
import { IUser } from '../user/user.interface';
import { JwtPayload } from 'jsonwebtoken';

const createOrUpdateUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await AuthService.createOrUpdateUser(userData);

    responseReturn<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created or update successfully!',
      data: result,
    });
  }
);

const currentUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.user as JwtPayload;
    const result = await AuthService.currentUser(email);

    responseReturn<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Current User Retrieved successfully!',
      data: result,
    });
  }
);

export const AuthUserController = {
  createOrUpdateUser,
  currentUser,
};
