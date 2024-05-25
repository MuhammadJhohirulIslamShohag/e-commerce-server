import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';

import { OtpValidation } from './opt.validation';
import { OTPController } from './otp.controller';

class OTPRoutesClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    this.routers.post(
      '/send-otp',
      validateRequest(OtpValidation.createOtpZodSchema),
      OTPController.sendOTP
    );
  }
}

const allRoutes = new OTPRoutesClass().routers;

export { allRoutes as OTPRoutes };
