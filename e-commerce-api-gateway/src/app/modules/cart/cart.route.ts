import { Router } from 'express';

import auth from '../../middlewares/auth';

import { CartController } from './cart.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';

class CartRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all carts routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN),
        CartController.createCart
      )
      .get(CartController.allCarts);

    // delete cart routes
    this.routers
      .route('/:id')
      .delete(auth(ENUM_USER_ROLE.ADMIN), CartController.deleteCart);
  }
}

const allRoutes = new CartRouterClass().routers;

export { allRoutes as CartRoutes };
