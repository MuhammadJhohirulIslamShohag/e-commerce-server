import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';
import ApiError from '../../errors/ApiError';

import { IOrder } from './order.interface';
import { OrderService } from './order.service';
import { JwtPayload } from 'jsonwebtoken';

class OrderControllerClass {
  #OrderService: typeof OrderService;

  constructor(service: typeof OrderService) {
    this.#OrderService = service;
  }
  // create order with cash_on_delivery controller
  readonly createOrder = catchAsync(async (req: Request, res: Response) => {
    const { ...orderData } = req.body;
    const { userId } = req.user as JwtPayload;

    const result = await this.#OrderService.createOrder(orderData, userId);

    // if not created order, throw error
    if (!result) {
      throw new ApiError(httpStatus.CONFLICT, `Order Create Failed!`);
    }

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order Created Successfully!',
      data: result,
    });
  });

  // create order with cash_on_delivery controller
  readonly createOrderWithCashOnDelivery = catchAsync(
    async (req: Request, res: Response) => {
      const { ...orderData } = req.body;
      const { userId } = req.user as JwtPayload;

      const result = await this.#OrderService.createOrderWithCashOnDelivery(
        orderData,
        userId
      );

      // if not created order, throw error
      if (!result) {
        throw new ApiError(
          httpStatus.CONFLICT,
          `Order Create With Cash_On_Delivery Failed!`
        );
      }

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order Created With Cash_On_Delivery Successfully!',
        data: result,
      });
    }
  );

  // get total discount price controller
  readonly totalDiscountPrice = catchAsync(
    async (req: Request, res: Response) => {
      const { couponName } = req.body;
      const { userId } = req.user as JwtPayload;

      const result = await this.#OrderService.totalDiscountPrice(
        couponName,
        userId
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Get Total Discount Price Successfully!',
        data: result,
      });
    }
  );

  // get all orders controller
  readonly allOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#OrderService.allOrders(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Orders Retrieved Successfully!',
      data: result,
    });
  });

  // get single order user controller
  readonly getSingleOrder = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    const result = await this.#OrderService.getSingleOrder(orderId);

    responseReturn<IOrder | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Order Retrieved Successfully!',
      data: result,
    });
  });

  // update order controller
  readonly updateOrder = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const { ...updateOrderData } = req.body;

    const result = await this.#OrderService.updateOrder(
      orderId,
      updateOrderData
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order Updated Successfully!',
      data: result,
    });
  });

  // update order tracking status controller
  readonly updateOrderStatusTracking = catchAsync(
    async (req: Request, res: Response) => {
      const orderId = req.params.id;
      const { ...order_tracking } = req.body;

      const result = await this.#OrderService.updateOrderStatusTracking(
        orderId,
        order_tracking
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order Tracking Status Updated Successfully!',
        data: result,
      });
    }
  );

  // delete order controller
  readonly deleteOrder = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const result = await this.#OrderService.deleteOrder(orderId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order Removed Successfully!',
      data: result,
    });
  });
}

export const OrderController = new OrderControllerClass(OrderService);
