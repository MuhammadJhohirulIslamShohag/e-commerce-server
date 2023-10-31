import { Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';
import { IUser } from './user.interface';
import httpStatus from 'http-status';
import { pick } from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { userFilterableFields } from './user.constant';

// get all users controller
const addUserCart: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
       // receiving carts data from frontend
       const { carts } = req.body;
       const email = req.user.email;

    const result = await UserService.addUserCart(carts, email);

    responseReturn<IUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const UserController = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile
};
