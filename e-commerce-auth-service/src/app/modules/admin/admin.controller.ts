import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';
import ApiError from '../../../errors/ApiError';
import config from '../../../config';
import { CreateReturnResponse, IAdmin } from './admin.interface';
import { AdminService } from './admin.service';
import { pick } from '../../../shared/pick';
import { paginationOptionFields } from '../../../constants/pagination';
import { adminFilterableFields } from './admin.constant';
import { IGenericResponse } from '../../../interfaces/common';

class AdminControllerClass {
  #AdminService: typeof AdminService;

  constructor(service: typeof AdminService) {
    this.#AdminService = service;
  }

  // create admin
  readonly CreateAdmin = catchAsync(async (req: Request, res: Response) => {
    const { ...adminData } = req.body;
    const result = await this.#AdminService.CreateAdmin(adminData);

    // if not created admin, throw error
    if (!result) {
      throw new ApiError(httpStatus.CONFLICT, `Admin Create Failed!`);
    }

    // set cookie to browser
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: config.env === 'production',
      sameSite: 'none' as const,
    };
    res.cookie('refreshToken', result?.refreshToken, cookieOptions);
    res.cookie('accessToken', result?.accessToken, cookieOptions);

    responseReturn<Pick<CreateReturnResponse, 'accessToken'> | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Created Successfully!',
      data: {
        accessToken: result.accessToken,
      },
    });
  });

  // login admin
  readonly LoginAdmin = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await this.#AdminService.LoginAdmin(loginData);

    // if not created admin, throw error
    if (!result) {
      throw new ApiError(httpStatus.CONFLICT, `Admin Create Failed!`);
    }

    // set cookie to browser
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: config.env === 'production',
      sameSite: 'none' as const,
    };
    res.cookie('refreshToken', result?.refreshToken, cookieOptions);
    res.cookie('accessToken', result?.accessToken, cookieOptions);

    responseReturn<Pick<
      CreateReturnResponse,
      'accessToken' | 'userInfo'
    > | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin login Successfully!',
      data: {
        accessToken: result.accessToken,
        userInfo: result?.userInfo,
      },
    });
  });

  // get all admins
  readonly AllAdmins = catchAsync(async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationOptionFields);
    const filters = pick(req.query, adminFilterableFields);

    const result = await this.#AdminService.AllAdmins(
      paginationOptions,
      filters
    );

    responseReturn<IGenericResponse<IAdmin[]>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Admins Retrieved Successfully!',
      data: result,
    });
  });

  // get single admin user
  readonly GetSingleAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const result = await this.#AdminService.GetSingleAdmin(adminId);

    responseReturn<IAdmin | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Admin Retrieved Successfully!',
      data: result,
    });
  });

  // update admin
  readonly UpdateAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const { ...updateAdminData } = req.body;
    const result = await this.#AdminService.UpdateAdmin(
      adminId,
      updateAdminData
    );

    responseReturn<IAdmin | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Updated Successfully!',
      data: result,
    });
  });

  // delete admin
  readonly DeleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const result = await this.#AdminService.DeleteAdmin(adminId);

    responseReturn<IAdmin | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Removed Successfully!',
      data: result,
    });
  });

  // refresh token
  readonly RefreshTokenForAdmin = catchAsync(
    async (req: Request, res: Response) => {
      const { refreshToken } = req.cookies;
      const result = await this.#AdminService.RefreshTokenForAdmin(
        refreshToken
      );

      // set cookie to browser
      const cookieOption = {
        secure: config.env === 'production',
        httpOnly: config.env === 'production',
        sameSite: 'none' as const,
      };

      res.cookie('refreshToken', refreshToken, cookieOption);
      res.cookie('accessToken', result?.accessToken, cookieOption);

      responseReturn<Pick<CreateReturnResponse, 'accessToken'> | null>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token created successfully!',
        data: result,
      });
    }
  );

  // admin password reset
  readonly AdminPasswordReset = catchAsync(
    async (req: Request, res: Response) => {
      const { ...userData } = req.body;
      const user = req.user as JwtPayload;
      const result = await this.#AdminService.AdminPasswordReset(
        user,
        userData
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password Reset successfully!',
        data: result,
      });
    }
  );
}

export const AdminController = new AdminControllerClass(AdminService);
