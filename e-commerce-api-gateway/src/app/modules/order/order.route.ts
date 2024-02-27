import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { OrderController } from './order.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';
import { OrderValidation } from './order.validation';

class OrderRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all orders routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(OrderValidation.orderCreateZodSchema),
        OrderController.createOrder
      )
      .get(OrderController.allOrders);

    // update and get single Order, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(OrderValidation.orderUpdateZodSchema),
        OrderController.updateOrder
      )
      .get(OrderController.getSingleOrder)
      .delete(auth(ENUM_USER_ROLE.ADMIN), OrderController.deleteOrder);
  }
}

const allRoutes = new OrderRouterClass().routers;

export { allRoutes as OrderRoutes };
