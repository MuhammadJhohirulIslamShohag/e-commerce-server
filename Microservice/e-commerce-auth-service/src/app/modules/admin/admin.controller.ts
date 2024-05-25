import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';

import config from '../../../config';
import catchAsync from '../../../utils/catchAsync';
import responseReturn from '../../../utils/responseReturn';

import { IAdmin } from './admin.interface';
import { AdminService } from './admin.service';
import { jwtHelpers } from '../../../helpers/jwt.helper';

class AdminControllerClass {
  #AdminService: typeof AdminService;

  constructor(service: typeof AdminService) {
    this.#AdminService = service;
  }

  // create admin method
  readonly createAdmin = catchAsync(async (req: Request, res: Response) => {
    const { ...adminData } = req.body;
    const result = await this.#AdminService.createAdmin(adminData);

    // access token
    const accessToken = jwtHelpers.createToken(
      {
        userId: result._id,
        role: result.role,
      },
      config?.jwt?.jwt_secret as Secret,
      config?.jwt?.jwt_expire_in as string
    );

    // refresh token
    const refreshToken = jwtHelpers.createToken(
      {
        userId: result?._id,
        role: result?.role,
      },
      config?.jwt?.jwt_refresh_secret as Secret,
      config?.jwt?.jwt_refresh_expire_in as string
    );

    // set cookie to browser
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: config.env === 'production',
      sameSite: 'none' as const,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('accessToken', accessToken, cookieOptions);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Created Successfully!',
      data: {
        accessToken: accessToken,
      },
    });
  });

  // login admin method
  readonly loginAdmin = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await this.#AdminService.loginAdmin(loginData);

    // access token
    const accessToken = jwtHelpers.createToken(
      {
        userId: result._id,
        role: result.role,
      },
      config?.jwt?.jwt_secret as Secret,
      config?.jwt?.jwt_expire_in as string
    );

    // refresh token
    const refreshToken = jwtHelpers.createToken(
      {
        userId: result?._id,
        role: result?.role,
      },
      config?.jwt?.jwt_refresh_secret as Secret,
      config?.jwt?.jwt_refresh_expire_in as string
    );

    // set cookie to browser
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: config.env === 'production',
      sameSite: 'none' as const,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    res.cookie('accessToken', accessToken, cookieOptions);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin login Successfully!',
      data: {
        accessToken: accessToken,
        userInfo: result,
      },
    });
  });

  // get all admins method
  readonly allAdmins = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#AdminService.allAdmins(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Admins Retrieved Successfully!',
      meta: result?.meta,
      data: result.result,
    });
  });

  // get single admin user method
  readonly getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const result = await this.#AdminService.getSingleAdmin(adminId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Admin Retrieved Successfully!',
      data: result,
    });
  });

  // update admin method
  readonly updateAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const { ...updateAdminData } = req.body;
    const result = await this.#AdminService.updateAdmin(
      adminId,
      updateAdminData
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Updated Successfully!',
      data: result,
    });
  });

  // delete admin method
  readonly deleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id;
    const result = await this.#AdminService.deleteAdmin(adminId);

    responseReturn<IAdmin | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin Removed Successfully!',
      data: result,
    });
  });

  // refresh token method
  readonly refreshTokenForAdmin = catchAsync(
    async (req: Request, res: Response) => {
      const { refreshToken } = req.cookies;
      const result = await this.#AdminService.refreshTokenForAdmin(
        refreshToken
      );

      // generate new token
      const accessToken = jwtHelpers.createToken(
        {
          userId: result._id,
          role: result.role,
        },
        config?.jwt?.jwt_secret as Secret,
        config?.jwt?.jwt_expire_in as string
      );

      // set cookie to browser
      const cookieOption = {
        secure: config.env === 'production',
        httpOnly: config.env === 'production',
        sameSite: 'none' as const,
      };

      res.cookie('refreshToken', refreshToken, cookieOption);
      res.cookie('accessToken', accessToken, cookieOption);

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token created successfully!',
        data: result,
      });
    }
  );

  // admin password reset method
  readonly adminPasswordReset = catchAsync(
    async (req: Request, res: Response) => {
      const { ...userData } = req.body;
      const user = req.user as JwtPayload;
      const result = await this.#AdminService.adminPasswordReset(
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
