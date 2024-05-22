import { Router } from 'express';
import { CartController } from './cart.controller';

class CartRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all carts routes
    this.routers.route('/').post(CartController.createCart);

    // update and get single cart, delete routes
    this.routers
      .route('/:id')
      .get(CartController.userCarts)
      .delete(CartController.deleteCart);
  }
}

const allRoutes = new CartRouterClass().routers;

export { allRoutes as CartRoutes };
