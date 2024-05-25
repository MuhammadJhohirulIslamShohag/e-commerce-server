import { Router } from 'express';

import { OrderValidation } from './order.validation';
import { OrderController } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';

class BrandRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // update order tracking status routes

    this.routers.patch(
      '/order-tracking-status/:id',
      validateRequest(OrderValidation.orderTrackingStatusUpdateZodSchema),
      OrderController.updateOrderStatusTracking
    );

    // create order with cash-on-delivery routes
    this.routers
      .route('/order-cash-on-delivery')
      .post(
        validateRequest(OrderValidation.orderCreateZodSchema),
        OrderController.createOrderWithCashOnDelivery
      );

    // create and get all orders routes
    this.routers.route('/').get(OrderController.allOrders);

    // get single order, delete routes
    this.routers
      .route('/:id')
      .get(OrderController.getSingleOrder)
      .patch(
        validateRequest(OrderValidation.orderUpdateZodSchema),
        OrderController.updateOrder
      )
      .patch(
        validateRequest(OrderValidation.orderTrackingStatusUpdateZodSchema),
        OrderController.updateOrderStatusTracking
      )
      .delete(OrderController.deleteOrder);
  }
}

const allRoutes = new BrandRouterClass().routers;

export { allRoutes as OrderRoutes };
