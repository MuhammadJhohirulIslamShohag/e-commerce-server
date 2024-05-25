import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import httpStatus from 'http-status';

import { StripeService } from './stripe.service';
import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

class StripeControllerClass {
  #StripeService: typeof StripeService;

  constructor(service: typeof StripeService) {
    this.#StripeService = service;
  }

  // create stripe controller
  readonly intentsCreateStripe = catchAsync(async (req: Request, res: Response) => {
    const { ...stripeData } = req.body;
    const { userId } = req.user as JwtPayload;

    const result = await this.#StripeService.intentsCreateStripe(stripeData, userId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Intents Stripe Created Successfully!',
      data: result,
    });
  });
}

export const StripeController = new StripeControllerClass(StripeService);
