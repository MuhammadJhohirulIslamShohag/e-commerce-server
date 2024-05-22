import { Request, Response } from 'express';
import httpStatus from 'http-status';

import responseReturn from '../../../utils/responseReturn';
import catchAsync from '../../../utils/catchAsync';

import { OTPService } from './otp.service';

class OTPControllerClass {
  #OTPService: typeof OTPService;

  constructor(service: typeof OTPService) {
    this.#OTPService = service;
  }

  // send otp
  readonly sendOTP = catchAsync(async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await this.#OTPService.sendOTP(userData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OTP Send Successfully!',
      data: result,
    });
  });
}

export const OTPController = new OTPControllerClass(OTPService);
