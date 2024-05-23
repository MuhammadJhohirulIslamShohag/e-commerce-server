import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class StripeServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create stripe service
  readonly createStripe = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `stripes/create-payment-intent`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const StripeService = new StripeServiceClass();
