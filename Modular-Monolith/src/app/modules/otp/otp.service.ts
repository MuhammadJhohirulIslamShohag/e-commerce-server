import httpStatus from 'http-status';

import Otp from '../otp/opt.model';
import ApiError from '../../errors/ApiError';
import OtpEmailTemplate from '../../helpers/emailTemplate/otpemailTemplate';

import { ICreateOtp } from './opt.interface';
import { GenerateNumberHelpers } from '../../helpers/generate-number.helper';
import { EmailSenderHelpers } from '../../helpers/email-send.helper';

class OTPServiceClass {
  #OtpModel;

  constructor() {
    this.#OtpModel = Otp;
  }

  // send otp
  readonly sendOTP = async (payload: ICreateOtp) => {

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
          expireDate: new Date(Date.now() + 10 * 60 * 1000),
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
    const messageId = await EmailSenderHelpers.sendEmailWithNodeMailer(
      mailData
    );
    if (messageId === 'failed') {
      message = 'Failed to Send OTP, Please Contact Their Support Section';
      await this.#OtpModel.findOneAndDelete({ email: payload.email });
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
