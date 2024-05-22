import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class CartServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create cart service
  readonly createCart = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `carts`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all carts service
  readonly allCarts = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(`carts`, {
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // get user carts service
  readonly userCarts = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(`carts/${id}`, {
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // delete cart service
  readonly deleteCart = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(`carts/${id}`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };
}

export const CartService = new CartServiceClass();
