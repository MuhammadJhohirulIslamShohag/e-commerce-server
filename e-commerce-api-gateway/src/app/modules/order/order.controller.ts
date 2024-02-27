import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { OrderService } from './order.service';

class OrderControllerClass {
  #OrderService: typeof OrderService;

  constructor(service: typeof OrderService) {
    this.#OrderService = service;
  }

  // create order controller
  readonly createOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#OrderService.createOrder(req);

    responseReturn(res, result);
  });

  // create order with cash_on_delivery controller
  readonly createOrderWithCashOnDelivery = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#OrderService.createOrderWithCashOnDelivery(
        req
      );

      responseReturn(res, result);
    }
  );

  // get all orders controller
  readonly allOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#OrderService.allOrders(req);

    responseReturn(res, result);
  });

  // get single order user controller
  readonly getSingleOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#OrderService.getSingleOrder(req);

    responseReturn(res, result);
  });

  // update order controller
  readonly updateOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#OrderService.updateOrder(req);

    responseReturn(res, result);
  });

  // update order tracking status controller
  readonly updateOrderStatusTracking = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#OrderService.updateOrderStatusTracking(req);

      responseReturn(res, result);
    }
  );
  
  // delete order controller
  readonly deleteOrder = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#OrderService.deleteOrder(req);

    responseReturn(res, result);
  });
}

export const OrderController = new OrderControllerClass(OrderService);
