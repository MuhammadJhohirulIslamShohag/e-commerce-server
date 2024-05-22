import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';

import config from '../../../config';
import catchAsync from '../../../utils/catchAsync';
import signUpSuccessEmailTemplate from '../../../utils/emailTemplate/signUpSuccessEmailTemplate';
import responseReturn from '../../../utils/responseReturn';

import { emailSenderHelpers } from '../../../helpers/emailSend.helper';
import { AuthService } from './auth.service';
import { jwtHelpers } from '../../../helpers/jwt.helper';

class AuthControllerClass {
  #AuthService: typeof AuthService;

  constructor(service: typeof AuthService) {
    this.#AuthService = service;
  }

  // create user
  readonly register = catchAsync(async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await this.#AuthService.register(userData);

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
    await emailSenderHelpers.sendEmailWithNodeMailer(mailData);

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
    const result = await this.#AuthService.loginUser(loginData);

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
    const result = await this.#AuthService.refreshToken(refreshToken);

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
  readonly passwordReset = catchAsync(async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await this.#AuthService.passwordReset(userData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password Reset successfully!',
      data: result,
    });
  });

  // password reset
  readonly userChangePasswordReset = catchAsync(
    async (req: Request, res: Response) => {
      const { ...userData } = req.body;
      const user = req.user as JwtPayload;
      const result = await this.#AuthService.userChangePassword(user, userData);

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password change successfully!',
        data: result,
      });
    }
  );
}

export const AuthController = new AuthControllerClass(AuthService);
