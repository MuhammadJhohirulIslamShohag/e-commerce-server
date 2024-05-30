import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';

import config from '../../config';
import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';
import signUpSuccessEmailTemplate from '../../helpers/emailTemplate/signUpSuccessEmailTemplate';

import { IAdmin } from './admin.interface';
import { AdminService } from './admin.service';
import { jwtHelpers } from '../../helpers/jwt.helper';
import { EmailSenderHelpers } from '../../helpers/email-send.helper';

class AdminControllerClass {
  #AdminService: typeof AdminService;

  constructor(service: typeof AdminService) {
    this.#AdminService = service;
  }

  // create user
  readonly register = catchAsync(async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await this.#AdminService.register(userData);

    // create access token
    const accessToken = jwtHelpers.createToken(
      {
        userId: result?._id,
        role: result?.role,
      },
      config?.jwt?.jwt_secret as Secret,
      config?.jwt?.jwt_expire_in as string
    );

    const refreshToken = jwtHelpers.createToken(
      {
        userId: result?._id,
        role: result?.role,
      },
      config?.jwt?.jwt_refresh_secret as Secret,
      config?.jwt?.jwt_refresh_expire_in as string
    );

    // set cookie to browser
    const cookieOption = {
      secure: config.env === 'production',
      httpOnly: config.env === 'production',
      sameSite: 'none' as const,
    };

    res.cookie('refreshToken', refreshToken || '', cookieOption);
    res.cookie('accessToken', accessToken, cookieOption);

    const mailData = {
      to: userData?.email,
      subject: 'Success',
      message: signUpSuccessEmailTemplate(result?.name || ''),
    };
    await EmailSenderHelpers.sendEmailWithNodeMailer(mailData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User registered successfully!',
      data: {
        user: result,
        token: {
          accessToken,
          refreshToken,
        },
      },
    });
  });

  // login user
  readonly login = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await this.#AdminService.login(loginData);

    // create access token and refresh token
    const accessToken = jwtHelpers.createToken(
      {
        userId: result._id,
        role: result.role,
      },
      config?.jwt?.jwt_secret as Secret,
      config?.jwt?.jwt_expire_in as string
    );

    const refreshToken = jwtHelpers.createToken(
      {
        userId: result._id,
        role: result.role,
      },
      config?.jwt?.jwt_refresh_secret as Secret,
      config?.jwt?.jwt_refresh_expire_in as string
    );

    // set cookie to browser
    const cookieOption = {
      secure: config.env === 'production',
      httpOnly: config.env === 'production' || false,
      sameSite: 'none' as const,
    };

    res.cookie('refreshToken', refreshToken, cookieOption);
    res.cookie('accessToken', accessToken, cookieOption);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged successfully!',
      data: {
        user: result,
        token: {
          accessToken,
          refreshToken,
        },
      },
    });
  });

  // refresh token controller
  readonly refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await this.#AdminService.refreshToken(refreshToken);

    // create access token
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
  });

  // password reset
  readonly forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await this.#AdminService.forgotPassword(userData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password Reset successfully!',
      data: result,
    });
  });

  // password reset
  readonly changePassword = catchAsync(async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const user = req.user as JwtPayload;
    const result = await this.#AdminService.changePassword(user, userData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password change successfully!',
      data: result,
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
}

export const AdminController = new AdminControllerClass(AdminService);
