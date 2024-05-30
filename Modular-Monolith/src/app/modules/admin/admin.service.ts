import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';

import Admin from './admin.model';
import QueryBuilder from '../../builder/query.builder';
import config from '../../config';
import ApiError from '../../errors/ApiError';

import { IAdmin, IRegister, TForgotPassword } from './admin.interface';
import { adminSearchableFields } from './admin.constant';
import { PasswordHelpers } from '../../helpers/password.helper';
import { jwtHelpers } from '../../helpers/jwt.helper';
import { OTPService } from '../otp/otp.service';

class AdminServiceClass {
  #AdminModel;
  #OTPService;
  #QueryBuilder: typeof QueryBuilder;

  constructor() {
    this.#AdminModel = Admin;
    this.#QueryBuilder = QueryBuilder;
    this.#OTPService = OTPService;
  }
  // create user
  readonly register = async (payload: IRegister) => {
    // check user is already exit
    const isUserExit = await this.#AdminModel.findOne({ email: payload.email });

    if (isUserExit) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User is already exit!');
    }

    // hash the password
    const hashedPassword = await PasswordHelpers.hashPassword(payload.password);

    // verifying otp
    await this.#OTPService.isOTPOk(payload.email, payload.otp);

    // create user
    const result = await this.#AdminModel.create({
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
  readonly login = async (payload: Pick<IAdmin, 'email' | 'password'>) => {
    const { email, password } = payload;

    // check user exits or not
    const isUserExit = await this.#AdminModel.findOne(
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

    const isPasswordMatch = await PasswordHelpers.comparePassword(
      password as string,
      isUserExit.password
    );

    // check password
    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect!');
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
    const isUserExit = await this.#AdminModel.findOne({ _id: userId });
    if (!isUserExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return isUserExit;
  };

  // password reset
  readonly forgotPassword = async (payload: TForgotPassword) => {
    // check user is already exit
    const isUserExit = await this.#AdminModel
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
    const result = await this.#AdminModel.findOneAndUpdate(
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
    const isUserExit = await this.#AdminModel.findOne(
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
    if (isUserExit?.email !== userData?.email) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized user!');
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
    const result = await this.#AdminModel.findOneAndUpdate(
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

  // get all admins method
  readonly allAdmins = async (query: Record<string, unknown>) => {
    const adminQuery = new this.#QueryBuilder(this.#AdminModel.find(), query)
      .search(adminSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of admin
    const result = await adminQuery.modelQuery;

    // get meta admin users
    const meta = await adminQuery.countTotal();

    return { meta, result };
  };

  // get single admin method
  readonly getSingleAdmin = async (payload: string) => {
    const result = await this.#AdminModel.findById(payload).exec();
    return result;
  };

  // update admin method
  readonly updateAdmin = async (id: string, payload: Partial<IAdmin>) => {
    // check already Admin exit, if not throw error
    const isExitAdmin = await this.#AdminModel.findOne({ id: id });
    if (!isExitAdmin) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin Not Found!');
    }
    const { shippingAddress, password, ...others } = payload;

    const updatedAdminData: Partial<IAdmin> = { ...others };

    // Check if the payload contains a password field
    if (password) {
      // Hash the new password
      const hashedPassword = await PasswordHelpers.hashPassword(password);

      if (!hashedPassword) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Admin Password Hashing Failed!'
        );
      }
      // Update the password hash in the payload
      updatedAdminData.password = hashedPassword;
    }

    // address update
    if (shippingAddress && Object.keys(shippingAddress)?.length > 0) {
      Object.keys(shippingAddress).map(key => {
        const addressKey = `shippingAddress.${key}` as keyof Partial<IAdmin>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (updatedAdminData as any)[addressKey] =
          shippingAddress[key as keyof typeof shippingAddress];
      });
    }

    // update the admin user
    const result = await this.#AdminModel.findOneAndUpdate(
      { _id: id },
      updatedAdminData,
      {
        new: true,
      }
    );

    return result;
  };

  // delete admin method
  readonly deleteAdmin = async (payload: string) => {
    // check already Admin exit, if not throw error
    const isExitAdmin = await this.#AdminModel.findOne({ _id: payload });
    if (!isExitAdmin) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin Not Found!');
    }

    // delete the admin user
    const result = await this.#AdminModel.findByIdAndDelete(payload);
    return result;
  };
}

export const AdminService = new AdminServiceClass();
