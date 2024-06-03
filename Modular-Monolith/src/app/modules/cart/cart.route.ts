import { Router } from 'express';
import auth from '../../middlewares/auth';

import { CartController } from './cart.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

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
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
        CartController.createCart
      );

    // update and get single cart, delete routes
    this.routers
      .route('/:id')
      .get(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
        CartController.userCarts
      )
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SELLER),
        CartController.deleteCart
      );
  }
}

const allRoutes = new CartRouterClass().routers;

export { allRoutes as CartRoutes };
