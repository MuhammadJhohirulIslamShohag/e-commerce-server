/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';

import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import sendSmsWithBulkSms from '../../../helpers/sendSms.helper';
import OtpEmailTemplate from '../../../utils/emailTemplate/otpemailTemplate';
import Otp from '../otp/opt.model';
import User from '../user/user.model';

import { emailSenderHelpers } from '../../../helpers/emailSend.helper';
import { GenerateNumberHelpers } from '../../../helpers/generateNumber.helper';
import { jwtHelpers } from '../../../helpers/jwt.helper';
import { IOtp } from '../otp/opt.interface';
import { IUser } from '../user/user.interface';

class AuthServiceClass {
  #UserModel;
  #OtpModel;

  constructor() {
    this.#UserModel = User;
    this.#OtpModel = Otp;
  }

  // create user
  readonly createUser = async (provider: string, payload: IUser) => {
    const query: Partial<{ email: string; phone: string }> = {};

    if (payload?.email) {
      query.email = payload.email;
    }

    if (payload?.phone !== undefined && payload.phone !== null) {
      query.phone = payload.phone;
    }

    // check user is already exit
    const isUserExit = await this.#UserModel.findOne(query);

    if (isUserExit) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User is already exit!');
    }

    // generate random number for opt and create otp
    const otp = GenerateNumberHelpers.generateRandomSixDigitNumber();

    const otpObj = {
      otp,
      email: payload?.email,
      phone: payload?.phone,
      expireDate: new Date().getDay() + 1,
      method: provider,
    };
    let message = '';
    const session = await mongoose.startSession();
    try {
      // start a session for the transaction
      session.startTransaction();

      const otpResult = await this.#OtpModel.create([otpObj], { session });
      if (!otpResult.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Otp create failed!');
      }

      // create user
      const result = await this.#UserModel.create([payload], { session });
      if (!result.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User create failed!');
      }
      const otp = otpResult[0];
      if (provider === 'email') {
        // set mail data for otp verification
        const mailData = {
          to: payload?.email,
          subject: 'OTP',
          message: OtpEmailTemplate(otp.otp),
        };
        // sent email using nodemailer
        const messageId = await emailSenderHelpers.sendEmailWithNodeMailer(
          mailData
        );
        if (messageId === 'failed') {
          message = 'Failed to send Otp, please contact their support section';
        } else {
          message =
            'Otp send your email for varififiction, please verify your email!';
        }
      }
      // if phone, send message by phone
      if (provider === 'phone') {
        const phoneNumber = payload?.phone;
        const smsData = `Max-E-commerce otp is ${otp?.otp}`;
        const result = await sendSmsWithBulkSms(phoneNumber, smsData);

        if (result.response_code === 202) {
          message =
            'sms sent successfully, please verify your account by phone !';
        }
      }
      // Commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
    return {
      message,
    };
  };

  // create user with verified
  readonly createUserWithVerified = async (
    otpPayload: Partial<IOtp>,
    userPayload: Partial<IUser>
  ) => {
    // check otp is expire or not
    const optResult = await this.#OtpModel.findOne({
      $or: [
        {
          otp: otpPayload,
          email: userPayload?.email,
        },
        {
          otp: otpPayload,
          phone: userPayload?.phone,
        },
      ],
    });

    if (!optResult) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid otp!');
    }

    // if (optResult && new Date().getDay() > optResult?.expireDate.getDay()) {
    //   throw new ApiError(httpStatus.CONFLICT, 'Email Verify is Expired!')
    // }

    let result = null;
    if (userPayload?.email) {
      result = await this.#UserModel.findOneAndUpdate(
        { email: userPayload.email },
        {
          emailVerified: true,
        },
        {
          new: true,
        }
      );
    }

    if (userPayload?.phone) {
      result = await this.#UserModel.findOneAndUpdate(
        { phone: userPayload.phone },
        {
          phoneNumberVerified: true,
        },
        {
          new: true,
        }
      );
    }

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User!');
    }

    // after email or phone verified, delete otp from otp collection
    if (result) {
      await this.#OtpModel.findOneAndDelete({
        $or: [
          {
            otp: otpPayload,
            email: userPayload?.email,
          },
          {
            otp: otpPayload,
            phone: userPayload?.phone,
          },
        ],
      });
    }

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

    return {
      accessToken,
      refreshToken,
      result,
    };
  };

  // login user
  readonly loginUser = async (
    payload: Pick<IUser, 'email' | 'password' | 'phone'>
  ) => {
    const { email, password, phone } = payload;

    const query: Partial<{ email: string; phone: string }> = {};

    if (email) {
      query.email = email;
    }

    if (phone) {
      query.phone = phone;
    }

    // check user exits or not
    const isUserExit = await this.#UserModel.findOne(query, {
      password: 1,
      name: 1,
      phone: 1,
      phoneNumberVerified: 1,
      email: 1,
      emailVerified: 1,
      profileImage: 1,
      address: 1,
      role: 1,
    });

    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // check user is verified
    if (!isUserExit.emailVerified && !isUserExit.phoneNumberVerified) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'User not verified, Please verify account!'
      );
    }
    // check password
    if (
      isUserExit.password &&
      !(await this.#UserModel.isPasswordMatched(password, isUserExit.password))
    ) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
    }

    // create access token and refresh token
    const { _id, role } = isUserExit;

    const accessToken = jwtHelpers.createToken(
      {
        userId: _id,
        role: role,
      },
      config?.jwt?.jwt_secret as Secret,
      config?.jwt?.jwt_expire_in as string
    );

    const refreshToken = jwtHelpers.createToken(
      {
        userId: _id,
        role: role,
      },
      config?.jwt?.jwt_refresh_secret as Secret,
      config?.jwt?.jwt_refresh_expire_in as string
    );

    const userInfo: any = isUserExit;
    return {
      accessToken,
      refreshToken,
      userInfo,
    };
  };

  // login user with social
  readonly loginUserWithSocial = async (
    payload: Pick<IUser, 'email' | 'name'>
  ) => {
    // check user exits or not
    const isUserExit = await this.#UserModel.isUserExit(payload?.email);
    if (isUserExit) {
      throw new ApiError(httpStatus.CONFLICT, 'User already exit!');
    }
    const result = await this.#UserModel.create(payload);

    if (!result) {
      throw new ApiError(400, 'User create failed!');
    }

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

    return {
      accessToken,
      refreshToken,
      result,
    };
  };

  // refresh token
  readonly refreshToken = async (token: string) => {
    // verify token
    let verifiedUser = null;
    try {
      verifiedUser = jwtHelpers.verifyToken(
        token,
        config?.jwt?.jwt_refresh_secret as Secret
      );
    } catch (error) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token!');
    }
    const { userId } = verifiedUser;

    // check user exits or not
    const isUserExit = await this.#UserModel.findOne({ _id: userId });
    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    // create access token and refresh token
    const { _id, role } = isUserExit;

    // generate new token
    const accessToken = jwtHelpers.createToken(
      {
        userId: _id,
        role: role,
      },
      config?.jwt?.jwt_secret as Secret,
      config?.jwt?.jwt_expire_in as string
    );

    return {
      accessToken,
    };
  };

  // forgot password
  readonly forgotPassword = async (
    provider: string,
    payload: Pick<IUser, 'email' | 'phone'>
  ) => {
    const query: Partial<{ email: string; phone: string }> = {};

    if (payload?.email) {
      query.email = payload.email;
    }

    if (payload?.phone) {
      query.phone = payload.phone;
    }
    // check user is already exit
    const isUserExit = await this.#UserModel.findOne(query);

    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    // generate random number for opt and create otp
    const otp = GenerateNumberHelpers.generateRandomSixDigitNumber();

    const otpObj = {
      otp,
      expireDate: new Date().getDay() + 1,
      email: payload?.email,
      phone: payload?.phone,
      method: provider,
    };

    let message = '';
    const session = await mongoose.startSession();
    try {
      // Start a session for the transaction
      session.startTransaction();

      const otpResult = await this.#OtpModel.create([otpObj], { session });
      if (!otpResult.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Otp create failed!');
      }

      const otp = otpResult[0];

      if (provider === 'email' && payload?.email) {
        // set mail data for otp verification
        const mailData = {
          to: payload?.email,
          subject: 'OTP',
          message: OtpEmailTemplate(otp?.otp),
        };
        // sent email using nodemailer
        await emailSenderHelpers.sendEmailWithNodeMailer(mailData);
        message =
          'Otp send your email for password reset, please reset your password!';
      }
      // if phone, send message by phone
      if (provider === 'phone' && payload?.phone) {
        const phoneNumber = payload.phone;
        const smsData = `Max-E-commerce otp is ${otp?.otp}`;
        const result = await sendSmsWithBulkSms(phoneNumber, smsData);
        if (result.response_code === 202) {
          message =
            'sms sent successfully, please verify your account by phone for reset password !';
        }
      }
      // Commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }

    return {
      message,
    };
  };

  // password reset
  readonly passwordReset = async (userData: {
    email?: string;
    password: string;
    phone?: string;
    otp: string;
  }) => {
    const query: Partial<{ email: string; phone: string }> = {};

    if (userData?.email) {
      query.email = userData.email;
    }

    if (userData?.phone) {
      query.phone = userData.phone;
    }
    // check user is already exit
    const isUserExit = await this.#UserModel.findOne(query);

    // check user is exit with email
    if (userData?.email) {
      if (isUserExit?.email !== userData?.email) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized user!');
      }
    }

    // check user is exit with phone
    if (userData?.phone) {
      if (isUserExit?.phone !== userData?.phone) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized user!');
      }
    }

    // check otp is expire or not
    const optResult = await this.#OtpModel.findOne({ otp: userData?.otp });

    if (!optResult) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid opt!');
    }

    // check otp is expire or not
    // if (optResult && new Date().getDay() > optResult?.expireDate.getDay()) {
    //   throw new ApiError(httpStatus.CONFLICT, 'Otp is Expired!')
    // }

    // hash the password
    const hashedPassword = await bcrypt.hash(
      userData?.password,
      Number(config?.bcrypt_salt_rounds)
    );

    // set new has password to exiting user
    const result = await this.#UserModel.findOneAndUpdate(
      query,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    // after reset password, delete otp from otp collection
    if (result) {
      await this.#OtpModel.findOneAndDelete({ otp: userData?.otp });
    }

    return result;
  };

  // password reset
  readonly userChangePasswordReset = async (
    user: JwtPayload,
    userData: {
      email?: string;
      newPassword: string;
      oldPassword: string;
      phone?: string;
    }
  ) => {
    // check user exits or not
    const isUserExit: any = await this.#UserModel.findById(
      { _id: user.userId },
      {
        password: 1,
        name: 1,
        phone: 1,
        phoneNumberVerified: 1,
        email: 1,
        emailVerified: 1,
        profileImage: 1,
        address: 1,
        role: 1,
      }
    );

    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    // check user is exit with email
    if (userData?.email) {
      if (isUserExit?.email !== userData?.email) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized user!');
      }
    }

    // check user is exit with phone
    if (userData?.phone) {
      if (isUserExit?.phone !== userData?.phone) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized user!');
      }
    }

    // check otp is expire or not
    // if (optResult && new Date().getDay() > optResult?.expireDate.getDay()) {
    //   throw new ApiError(httpStatus.CONFLICT, 'Otp is Expired!')
    // }

    // check password
    if (
      isUserExit?.password &&
      !(await this.#UserModel.isPasswordMatched(
        userData?.oldPassword,
        isUserExit?.password
      ))
    ) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
    }

    // check password same regarding old password
    if (
      isUserExit?.password &&
      (await this.#UserModel.isPasswordMatched(
        userData?.newPassword,
        isUserExit?.password
      ))
    ) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Your old and confirm password same!'
      );
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(
      userData?.newPassword,
      Number(config?.bcrypt_salt_rounds)
    );

    const query: Partial<{ email: string; phone: string }> = {};

    if (userData?.email) {
      query.email = userData.email;
    }

    if (userData?.phone !== undefined) {
      query.phone = userData.phone;
    }

    // set new has password to exiting user
    const result = await this.#UserModel.findOneAndUpdate(
      query,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    return result;
  };

  // re-send otp
  readonly resendOtp = async (
    optPayload: Pick<IOtp, 'email' | 'phone'>,
    provider: string
  ) => {
    const query: Partial<{ email: string; phone: string }> = {};

    if (optPayload?.email) {
      query.email = optPayload.email;
    }

    if (optPayload?.phone) {
      query.phone = optPayload.phone;
    }

    // check user exits or not
    const isUserExit = await this.#UserModel.findOne(query);

    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }
    // generate random number for opt and create otp
    const otp = GenerateNumberHelpers.generateRandomSixDigitNumber();

    const otpObj = {
      otp,
      email: optPayload?.email || null,
      phone: optPayload?.phone || null,
      expireDate: new Date().getDay() + 1,
      method: provider,
    };

    let message = '';
    const session = await mongoose.startSession();

    try {
      // start a session for the transaction
      session.startTransaction();

      const otpResult = await this.#OtpModel.create([otpObj], { session });
      if (!otpResult.length) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Otp create failed!');
      }

      const otp = otpResult[0];
      if (provider === 'email') {
        // set mail data for otp verification
        const mailData = {
          to: optPayload?.email,
          subject: 'OTP',
          message: OtpEmailTemplate(otp.otp),
        };
        // sent email using nodemailer
        const messageId = await emailSenderHelpers.sendEmailWithNodeMailer(
          mailData
        );

        if (messageId === 'failed') {
          message = 'Failed to send Otp, please contact their support section';
        } else {
          message =
            'Otp send your email for verification, please verify your email!';
        }
      }
      // if phone, send message by phone
      if (provider === 'phone') {
        const phoneNumber = optPayload?.phone;
        const smsData = `E-commerce otp is ${otp?.otp}`;
        const result = await sendSmsWithBulkSms(phoneNumber, smsData);

        if (result.response_code === 202) {
          message =
            'SMS sent successfully, please verify your account by phone !';
        }
      }
      // Commit the transaction
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
    return {
      message,
    };
  };
}

export const AuthService = new AuthServiceClass();
