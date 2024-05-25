import { Request } from 'express';

import { AuthService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class UserServiceClass {
  #AuthService;
  constructor() {
    this.#AuthService = AuthService;
  }

  // get all users method
  readonly allUsers = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.get(`users`, {
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // update shipping address method
  readonly updateShippingAddressToUser = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.patch(
      `users/update-shipping-address`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };


  // get single user method
  readonly getSingleUser = async (req: Request) => {
    const { id } = req.params;
    const response: IGenericResponse = await this.#AuthService.get(
      `users/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // update user method
  readonly updateUser = async (req: Request) => {
    const { id } = req.params;
    const response: IGenericResponse = await this.#AuthService.patch(
      `users/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete user method
  readonly deleteUser = async (req: Request) => {
    const { id } = req.params;
    const response: IGenericResponse = await this.#AuthService.delete(
      `users/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // add save wish list method
  readonly addWishListProduct = async (req: Request) => {
    const response: IGenericResponse = await this.#AuthService.post(
      `users/wishlist`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete wish list method
  readonly deleteProductFromWishlist = async (req: Request) => {
    const { wishlistId } = req.params;
    const response: IGenericResponse = await this.#AuthService.delete(
      `users/wishlist/${wishlistId}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const UserService = new UserServiceClass();
