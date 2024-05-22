import httpStatus from 'http-status';

import Otp from '../otp/opt.model';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import OtpEmailTemplate from '../../../utils/emailTemplate/otpemailTemplate';

import { emailSenderHelpers } from '../../../helpers/emailSend.helper';
import { GenerateNumberHelpers } from '../../../helpers/generateNumber.helper';
import { ICreateOtp } from './opt.interface';

class OTPServiceClass {
  #UserModel;
  #OtpModel;

  constructor() {
    this.#UserModel = User;
    this.#OtpModel = Otp;
  }

  // send otp
  readonly sendOTP = async (payload: ICreateOtp) => {
    // check user is already exit
    const isUserExit = await this.#UserModel.findOne({ email: payload.email });

    if (isUserExit) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'User is already exit!');
    }

    // check otp is already exit
    const isOTPExit = await this.#OtpModel.findOne({ email: payload.email });

    // generate random number for opt and create otp
    const otp = GenerateNumberHelpers.generateRandomSixDigitNumber();

    let result;

    if (isOTPExit) {
      result = await this.#OtpModel.findOneAndUpdate(
        { email: payload.email },
        {
          otp,
          email: payload.email,
          expireDate: new Date(Date.now() + 5 * 60 * 1000),
        },
        { new: true }
      );
    } else {
      result = await this.#OtpModel.create({
        otp,
        email: payload.email,
      });
    }

    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Otp create failed!'
      );
    }

    let message;

    // set mail data for otp verification
    const mailData = {
      to: payload?.email,
      subject: 'OTP',
      message: OtpEmailTemplate(otp),
    };

    // sent email using nodemailer
    const messageId = await emailSenderHelpers.sendEmailWithNodeMailer(
      mailData
    );
    if (messageId === 'failed') {
      message = 'Failed to Send OTP, Please Contact Their Support Section';
    } else {
      message =
        'OTP Send your Email for Verification, Please Verify your Email!';
    }

    return message;
  };

  // verify otp
  readonly isOTPOk = async (email: string, otp: number) => {
    const isOTPExit = await this.#OtpModel.findOne({ email: email, otp: otp });

    if (
      !isOTPExit ||
      isOTPExit.expireDate < new Date() ||
      isOTPExit.otp !== otp
    ) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Invalid Or Expire OTP!');
    }
  };

  // delete otp
  readonly deleteOTP = async (email: string, otp: number) => {
    await this.#OtpModel.findOneAndDelete({ otp, email });
  };
}

export const OTPService = new OTPServiceClass();
