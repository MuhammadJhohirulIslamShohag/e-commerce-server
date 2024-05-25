import { Request } from 'express';

import { AuthService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class OTPServiceClass {
  #AuthService;
  constructor() {
    this.#AuthService = AuthService;
  }

  // send otp
  readonly sendOTP = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `otp/send-otp`,
      req.body
    );
    return response;
  };
}

export const OTPService = new OTPServiceClass();
