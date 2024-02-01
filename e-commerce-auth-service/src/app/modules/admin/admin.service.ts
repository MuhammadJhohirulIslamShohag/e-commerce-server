/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload, Secret } from 'jsonwebtoken';

import ApiError from '../../../errors/ApiError';
import { IAdmin } from './admin.interface';
import Admin from './admin.model';
import config from '../../../config';
import QueryBuilder from '../../../builder/query.builder';

import { adminSearchableFields } from './admin.constant';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { passwordHelpers } from '../../../helpers/passwordHelper';

class AdminServiceClass {
  #AdminModel;
  #QueryBuilder: typeof QueryBuilder;

  constructor() {
    this.#AdminModel = Admin;
    this.#QueryBuilder = QueryBuilder;
  }

  // create admin method
  readonly createAdmin = async (payload: IAdmin) => {
    // check already Admin exit, if not, throw error
    const isExitAdmin = await this.#AdminModel.isExitAdmin({
      email: payload?.email,
    });
    if (isExitAdmin) {
      throw new ApiError(httpStatus.CONFLICT, `Admin Is Already Exit!`);
    }

    // check password and email has on payload, if not throw error
    if (!payload.email || !payload.password) {
      throw new ApiError(httpStatus.CONFLICT, 'Invalid Credentials!');
    }

    // create new Admin
    const result = await this.#AdminModel.create(payload);

    // access token
    const accessToken = jwtHelpers.createToken(
      {
        userId: result?._id,
        role: result?.role,
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
    return {
      accessToken,
      refreshToken,
    };
  };

  // login admin method
  readonly loginAdmin = async (payload: IAdmin) => {
    const { email } = payload;
    if (!email && !payload?.password) {
      throw new ApiError(httpStatus.CONFLICT, `Invalid credentials!`);
    }

    // check already admin exit, if not, throw error
    const isExitAdmin: any = await this.#AdminModel.findOne(
      { email: payload?.email },
      {
        password: 1,
        name: 1,
        email: 1,
        profileImage: 1,
        role: 1,
        status: 1,
        workAs: 1,
      }
    );

    if (!isExitAdmin) {
      throw new ApiError(httpStatus.NOT_FOUND, `Admin not found!`);
    }

    // check password
    if (
      isExitAdmin.password &&
      !(await this.#AdminModel.isPasswordMatch(
        payload.password,
        isExitAdmin?.password
      ))
    ) {
      throw new ApiError(httpStatus.CONFLICT, 'Password does not match!');
    }

    // password delete
    delete isExitAdmin._doc.password;

    // access token
    const accessToken = jwtHelpers.createToken(
      {
        userId: isExitAdmin?._id,
        role: isExitAdmin?.role,
      },
      config?.jwt?.jwt_secret as Secret,
      config?.jwt?.jwt_expire_in as string
    );

    // refresh token
    const refreshToken = jwtHelpers.createToken(
      {
        userId: isExitAdmin?._id,
        role: isExitAdmin?.role,
      },
      config?.jwt?.jwt_refresh_secret as Secret,
      config?.jwt?.jwt_refresh_expire_in as string
    );

    return {
      accessToken,
      refreshToken,
      userInfo: isExitAdmin,
    };
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
  readonly getSingleAdmin = async (payload: string): Promise<IAdmin | null> => {
    const result = await this.#AdminModel.findById(payload).exec();
    return result;
  };

  // update admin method
  readonly updateAdmin = async (id: string, payload: Partial<IAdmin>) => {
    // check already Admin exit, if not throw error
    const isExitAdmin = await this.#AdminModel.isExitAdmin({ id: id });
    if (!isExitAdmin) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin Not Found!');
    }
    const { address, password, ...others } = payload;

    const updatedAdminData: Partial<IAdmin> = { ...others };

    // Check if the payload contains a password field
    if (password) {
      // Hash the new password
      const hashedPassword = await passwordHelpers.hashPassword(password);

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
    if (address && Object.keys(address)?.length > 0) {
      Object.keys(address).map(key => {
        const addressKey = `address.${key}` as keyof Partial<IAdmin>;
        (updatedAdminData as any)[addressKey] =
          address[key as keyof typeof address];
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
  readonly deleteAdmin = async (payload: string): Promise<IAdmin | null> => {
    // check already Admin exit, if not throw error
    const isExitAdmin = await this.#AdminModel.isExitAdmin({ id: payload });
    if (!isExitAdmin) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin Not Found!');
    }

    // delete the admin user
    const result = await this.#AdminModel.findByIdAndDelete(payload);
    return result;
  };

  // refresh token for admin method
  readonly refreshTokenForAdmin = async (token: string) => {
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
    const isAdminExit = await this.#AdminModel.findOne({ _id: userId });
    if (!isAdminExit) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found!');
    }

    // generate new token
    const accessToken = jwtHelpers.createToken(
      {
        userId: isAdminExit._id,
        role: isAdminExit.role,
      },
      config?.jwt?.jwt_secret as Secret,
      config?.jwt?.jwt_expire_in as string
    );

    return {
      accessToken,
    };
  };

  // password reset method
  readonly adminPasswordReset = async (
    user: JwtPayload,
    userData: {
      email?: string;
      newPassword: string;
      oldPassword: string;
      phone?: string;
    }
  ) => {
    // check user exits or not
    const isUserExit: any = await this.#AdminModel.findOne(
      { _id: user.userId },
      {
        password: 1,
        name: 1,
        phone: 1,
        email: 1,
        profileImage: 1,
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
      isUserExit.password &&
      !(await this.#AdminModel.isPasswordMatch(
        userData?.oldPassword,
        isUserExit.password
      ))
    ) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
    }

    // check password same regarding old password
    if (
      isUserExit?.password &&
      (await this.#AdminModel.isPasswordMatch(
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
    const result = await this.#AdminModel.findOneAndUpdate(
      query,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    // console.log(result, 'result', isUserExit, 'isUserExit', userData, 'userData')

    return result;
  };
}

export const AdminService = new AdminServiceClass();
