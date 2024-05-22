import { Request, Response } from 'express';

import { OTPService } from './otp.service';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

class OTPControllerClass {
  #OTPService: typeof OTPService;

  constructor(service: typeof OTPService) {
    this.#OTPService = service;
  }

  // send otp
  readonly sendOTP = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#OTPService.sendOTP(req);

    responseReturn(res, result);
  });
}

export const OTPController = new OTPControllerClass(OTPService);
