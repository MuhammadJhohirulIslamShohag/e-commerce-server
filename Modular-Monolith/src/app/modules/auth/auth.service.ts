import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';

import User from '../user/user.model';
import config from '../../config';
import ApiError from '../../errors/ApiError';

import { jwtHelpers } from '../../helpers/jwt.helper';
import { PasswordHelpers } from '../../helpers/password.helper';
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { password, ...user } = result.toObject();

    return user;
  };

  // login user
  readonly loginUser = async (payload: Pick<IUser, 'email' | 'password'>) => {
    // check user exits or not
    const isUserExit = await this.#UserModel.findOne(
      { email: payload?.email },
      {
        email: 1,
        about: 1,
        wishLists: 1,
        shippingAddress: 1,
        status: 1,
        password: 1,
        name: 1,
        profileImage: 1,
        role: 1,
      }
    );

    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User not found!');
    }

    const isPasswordMatch = await PasswordHelpers.comparePassword(
      payload?.password as string,
      isUserExit.password
    );

    // check password
    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect!');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { password, ...user } = isUserExit.toObject();

    return user;
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
  readonly forgotPassword = async (payload: TForgotPassword) => {
    // check user is already exit
    const isUserExit = await this.#UserModel
      .findOne({ email: payload?.email })
      .select('password email');

    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User Not Found!');
    }

    // check user is exit with email
    if (isUserExit?.email !== payload?.email) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized user!');
    }

    // verifying otp
    await this.#OTPService.isOTPOk(payload.email, payload.otp);

    // hash the password
    const hashedPassword = await PasswordHelpers.hashPassword(
      payload?.password
    );

    // check password
    if (!hashedPassword) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
    }

    // set new has password to exiting user
    const result = await this.#UserModel.findOneAndUpdate(
      { email: payload?.email },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    return result;
  };

  // user change password
  readonly changePassword = async (
    user: JwtPayload,
    userData: {
      email: string;
      newPassword: string;
      oldPassword: string;
    }
  ) => {
    // check user exits or not
    const isUserExit = await this.#UserModel.findOne(
      { _id: user.userId },
      {
        email: 1,
        about: 1,
        wishLists: 1,
        shippingAddress: 1,
        status: 1,
        password: 1,
        name: 1,
        profileImage: 1,
        role: 1,
      }
    );

    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    const isNewPasswordMatch = await PasswordHelpers.comparePassword(
      userData?.newPassword,
      isUserExit.password
    );

    const isOldPasswordMatch = await PasswordHelpers.comparePassword(
      userData?.oldPassword,
      isUserExit.password
    );

    // check password not same regarding old password
    if (isUserExit?.password && !isOldPasswordMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
    }

    // check password same regarding old password
    if (isUserExit?.password && isNewPasswordMatch) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Your old and new password same!'
      );
    }

    // hash the password
    const hashedPassword = await PasswordHelpers.hashPassword(
      userData?.newPassword
    );

    // set new has password to exiting user
    const result = await this.#UserModel.findOneAndUpdate(
      { email: userData?.email },
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
