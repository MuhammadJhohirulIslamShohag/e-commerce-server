import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

import config from '../../../config';
import catchAsync from '../../../utils/catchAsync';
import signUpSuccessEmailTemplate from '../../../utils/emailTemplate/signUpSuccessEmailTemplate';
import responseReturn from '../../../utils/responseReturn';

import { emailSenderHelpers } from '../../../helpers/emailSend.helper';
import { AuthService } from './auth.service';

class AuthControllerClass {
  #AuthService: typeof AuthService;

  constructor(service: typeof AuthService) {
    this.#AuthService = service;
  }

  // create user
  readonly createUser = catchAsync(async (req: Request, res: Response) => {
    const { provider, ...userData } = req.body;
    const result = await this.#AuthService.createUser(provider, userData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    });
  });

  // create user with verified
  readonly createUserWithVerified = catchAsync(
    async (req: Request, res: Response) => {
      const { otp, ...userData } = req.body;
      const result = await this.#AuthService.createUserWithVerified(
        otp,
        userData
      );

      const { refreshToken, ...other } = result;

      // set cookie to browser
      const cookieOption = {
        secure: config.env === 'production',
        httpOnly: config.env === 'production',
        sameSite: 'none' as const,
      };

      res.cookie('refreshToken', refreshToken || '', cookieOption);
      res.cookie('accessToken', result.accessToken, cookieOption);

      const mailData = {
        to: userData?.email,
        subject: 'Success',
        message: signUpSuccessEmailTemplate(result?.result?.name || ''),
      };
      await emailSenderHelpers.sendEmailWithNodeMailer(mailData);

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User registered successfully!',
        data: other,
      });
    }
  );

  // login user
  readonly loginUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await this.#AuthService.loginUser(loginData);

    const { refreshToken, ...other } = result;

    // set cookie to browser
    const cookieOption = {
      secure: config.env === 'production',
      httpOnly: config.env === 'production' || false,
      sameSite: 'none' as const,
    };

    res.cookie('refreshToken', refreshToken, cookieOption);
    res.cookie('accessToken', result.accessToken, cookieOption);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged successfully!',
      data: other,
    });
  });

  // login user with social
  readonly loginUserWithSocial = catchAsync(
    async (req: Request, res: Response) => {
      const { ...loginData } = req.body;
      const result = await this.#AuthService.loginUserWithSocial(loginData);

      const { refreshToken, ...other } = result;

      // set cookie to browser
      const cookieOption = {
        secure: config.env === 'production',
        httpOnly: false,
        sameSite: 'none' as const,
      };

      res.cookie('refreshToken', refreshToken, cookieOption);

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged with social successfully!',
        data: other,
      });
    }
  );

  // refresh token controller
  readonly refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await this.#AuthService.refreshToken(refreshToken);

    // set cookie to browser
    const cookieOption = {
      secure: config.env === 'production',
      httpOnly: config.env === 'production',
      sameSite: 'none' as const,
    };

    res.cookie('refreshToken', refreshToken, cookieOption);

    res.cookie('accessToken', result.accessToken, cookieOption);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token created successfully!',
      data: result,
    });
  });

  // forgot password
  readonly forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { provider, ...userData } = req.body;
    const result = await this.#AuthService.forgotPassword(provider, userData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null,
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
      const result = await this.#AuthService.userChangePasswordReset(
        user,
        userData
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password change successfully!',
        data: result,
      });
    }
  );

  // re-send otp
  readonly resendOtp = catchAsync(async (req: Request, res: Response) => {
    const { provider, ...otpResendData } = req.body;
    const result = await this.#AuthService.resendOtp(otpResendData, provider);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Otp Resend successfully!',
      data: result,
    });
  });
}

export const AuthController = new AuthControllerClass(AuthService);
