import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';

import User from '../user/user.model';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

import { jwtHelpers } from '../../../helpers/jwt.helper';
import { PasswordHelpers } from '../../../helpers/password.helper';
import { ICreateUser, IUser, TForgotPassword } from '../user/user.interface';
import { OTPService } from '../otp/otp.service';

class AuthServiceClass {
  #UserModel;
  #OTPService;

  constructor() {
    this.#UserModel = User;
    this.#OTPService = OTPService;
  }

  // create user
  readonly register = async (payload: ICreateUser) => {
    // check user is already exit
    const isUserExit = await this.#UserModel.findOne({ email: payload.email });

    if (isUserExit) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User is already exit!');
    }

    // hash the password
    const hashedPassword = await PasswordHelpers.hashPassword(payload.password);

    // verifying otp
    await this.#OTPService.isOTPOk(payload.email, payload.otp);

    // create user
    const result = await this.#UserModel.create({
      ...payload,
      password: hashedPassword,
    });

    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'User create failed!'
      );
    }

    return result;
  };

  // login user
  readonly loginUser = async (payload: Pick<IUser, 'email' | 'password'>) => {
    const { email, password } = payload;

    // check user exits or not
    const isUserExit = await this.#UserModel.findOne(
      { email },
      {
        password: 1,
        name: 1,
        email: 1,
        profileImage: 1,
        shippingAddress: 1,
        role: 1,
      }
    );

    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User not found!');
    }

    // hash the new password
    const hashedPassword = await PasswordHelpers.hashPassword(password);

    // check password
    if (isUserExit.password && !hashedPassword) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
    }

    return isUserExit;
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

    return isUserExit;
  };

  // password reset
  readonly passwordReset = async (payload: TForgotPassword) => {
    // check user is already exit
    const isUserExit = await this.#UserModel.findOne({ email: payload.email });

    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User Not Found!');
    }

    // check user is exit with email
    if (payload?.email) {
      if (isUserExit?.email !== payload?.email) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized user!');
      }
    }

    // verifying otp
    await this.#OTPService.isOTPOk(payload.email, payload.otp);

    // hash the password
    const hashedPassword = await bcrypt.hash(
      payload?.password,
      Number(config?.bcrypt_salt_rounds)
    );

    // set new has password to exiting user
    const result = await this.#UserModel.findOneAndUpdate(
      { email: payload.email },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    // after reset password, delete otp from otp collection
    if (result) {
      await this.#OTPService.deleteOTP(payload.email, payload.otp);
    }

    return result;
  };

  // user change password
  readonly userChangePassword = async (
    user: JwtPayload,
    userData: {
      email: string;
      newPassword: string;
      oldPassword: string;
    }
  ) => {
    // check user exits or not
    const isUserExit = await this.#UserModel.findById(
      { _id: user.userId },
      {
        password: 1,
        name: 1,
        email: 1,
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

    const isPasswordMatch = await PasswordHelpers.comparePassword(
      userData?.oldPassword,
      isUserExit.password
    );

    // check password
    if (isUserExit?.password && !isPasswordMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
    }

    // check password same regarding old password
    if (isUserExit?.password && isPasswordMatch) {
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

    // set new has password to exiting user
    const result = await this.#UserModel.findOneAndUpdate(
      { email: userData.email },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    return result;
  };
}

export const AuthService = new AuthServiceClass();
