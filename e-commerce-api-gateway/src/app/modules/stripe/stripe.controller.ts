import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { StripeService } from './stripe.service';

class StripeControllerClass {
  #StripeService: typeof StripeService;

  constructor(service: typeof StripeService) {
    this.#StripeService = service;
  }

  // create stripe controller
  readonly createStripe = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#StripeService.createStripe(req);

    responseReturn(res, result);
  });
}

export const StripeController = new StripeControllerClass(StripeService);
