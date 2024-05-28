import httpStatus from 'http-status';
import { Types } from 'mongoose';

import Cart from '../cart/cart.model';
import Order from './order.model';
import Product from '../product/product.model';
import Coupon from '../coupon/coupon.model';
import ApiError from '../../errors/ApiError';
import QueryBuilder from '../../builder/query.builder';

import { orderSearchableFields, orderTrackingStatus } from './order.constant';
import {
  ICreateOrderWithCashOnDelivery,
  IOrder,
  IOrderTacking,
} from './order.interface';
import { getUniqueKey } from '../../shared/getUniqueKey';
import { ICart } from '../cart/cart.interface';
import { ICoupon } from '../coupon/coupon.interface';

class OrderServiceClass {
  #OrderModel;
  #ProductModel;
  #CartModel;
  #CouponModel;
  #QueryBuilder: typeof QueryBuilder;

  constructor() {
    this.#OrderModel = Order;
    this.#ProductModel = Product;
    this.#CartModel = Cart;
    this.#CouponModel = Coupon;
    this.#QueryBuilder = QueryBuilder;
  }

  // create order service
  readonly createOrder = async (payload: IOrder, user: string) => {
    const { paymentIntents, paymentBy, billingAddress } = payload;

    // which product carts
    const carts = await this.#CartModel.findOne({ orderedBy: user }).exec();
    const { products } = carts as ICart;

    // *** tracking order *** //
    const modifyOrderTracking = {
      title: 'ordered',
      courier: '',
      trackingNumber: '',
    };

    // ordered history
    const modifyOrderedHistory = orderTrackingStatus.map(ots => {
      if (ots === 'ordered') {
        return {
          status: ots,
          isDone: true,
          timestamp: `${new Date()}`,
        };
      } else {
        return {
          status: ots,
          isDone: false,
          timestamp: '',
        };
      }
    });

    // save to the database
    await new Order({
      products,
      paymentIntents: paymentIntents,
      orderedBy: user,
      trackingInfo: modifyOrderTracking,
      orderHistory: modifyOrderedHistory,
      paymentBy,
      billingAddress,
    }).save();

    // decrement quantity and sold increment
    const bulkOption = products.map(
      (item: { product: Types.ObjectId; count: number; price: number }) => {
        return {
          updateOne: {
            filter: {
              _id: item.product,
            },
            update: {
              $inc: {
                quantity: -item.count,
                sold: +item.count,
              },
            },
          },
        };
      }
    );

    // update
    await this.#ProductModel.bulkWrite(bulkOption, {});
    return { ok: true };
  };

  // create order with cash_on_delivery service
  readonly createOrderWithCashOnDelivery = async (
    payload: ICreateOrderWithCashOnDelivery,
    user: string
  ) => {
    const { isCashOnDelivery, isCoupon, billingAddress } = payload;

    // if isCashOnDelivery is true, it is going to process to the cash on delivery
    if (!isCashOnDelivery) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Create Cash Order is Failed!'
      );
    }

    // which carts
    const userCarts = await this.#CartModel.findOne({ orderedBy: user }).lean();

    if (!userCarts) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cart Not Found!');
    }

    const { products, totalPriceAfterDiscount, cartTotal } = userCarts as ICart;

    let finalAmount = 0;
    if (isCoupon) {
      if (totalPriceAfterDiscount) {
        finalAmount = totalPriceAfterDiscount * 100;
      } else {
        finalAmount = cartTotal * 100;
      }
    } else {
      finalAmount = cartTotal * 100;
    }

    // *** tracking order *** //
    const modifyOrderTracking = {
      title: 'ordered',
      courier: '',
      trackingNumber: '',
    };

    // ordered history
    const modifyOrderedHistory = orderTrackingStatus.map(ots => {
      if (ots === 'ordered') {
        return {
          status: ots,
          isDone: true,
          timestamp: `${new Date()}`,
        };
      } else {
        return {
          status: ots,
          isDone: false,
          timestamp: '',
        };
      }
    });

    const update = await new Order({
      products,
      paymentIntents: {
        id: getUniqueKey('ORD'),
        amount: finalAmount,
        currency: 'usd',
        payment_method_types: ['Cash'],
        status: 'succeeded',
        created: Date.now(),
      },
      orderStatus: 'ordered',
      paymentBy: 'Cash',
      orderedBy: user,
      trackingInfo: modifyOrderTracking,
      orderHistory: modifyOrderedHistory,
      billingAddress,
    }).save();

    // decrement quantity and sold increment
    const bulkOption = products.map(
      (item: { product: Types.ObjectId; count: number; price: number }) => {
        return {
          updateOne: {
            filter: {
              _id: item.product,
            },
            update: {
              $inc: {
                quantity: -item.count,
                sold: +item.count,
              },
            },
          },
        };
      }
    );

    // update
    await this.#ProductModel.bulkWrite(bulkOption, {});

    return { ok: true, update };
  };

  // get total discount price service
  readonly totalDiscountPrice = async (couponName: string, user: string) => {
    // checking is it valid coupon or not
    const validationCoupon = await this.#CouponModel
      .findOne({
        name: couponName,
      })
      .exec();

    if (validationCoupon === null) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Coupon');
    }

    // getting carts by the userId
    const carts = await this.#CartModel
      .findOne({ orderedBy: user })
      .populate('products.product', '_id title price')
      .exec();

    const { cartTotal } = carts as ICart;

    const { discountAmount, discountType } = validationCoupon as ICoupon;

    let totalPriceAfterDiscount = 0;

    if (discountType == 'Percentage') {
      totalPriceAfterDiscount = cartTotal - (cartTotal * discountAmount) / 100;
    } else {
      totalPriceAfterDiscount = cartTotal - discountAmount;
    }

    await this.#CartModel
      .findOneAndUpdate(
        { orderedBy: user },
        {
          totalPriceAfterDiscount,
        },
        { new: true }
      )
      .exec();

    return totalPriceAfterDiscount;
  };

  // get all orders service
  readonly allOrders = async (query: Record<string, unknown>) => {
    const orderQuery = new this.#QueryBuilder(this.#OrderModel.find(), query)
      .search(orderSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields()
      .populate();

    // result of orders
    const result = await orderQuery.modelQuery;

    // get meta orders
    const meta = await orderQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single order service
  readonly getSingleOrder = async (payload: string) => {
    const result = await this.#OrderModel
      .findById(payload)
      .populate('products.productId')
      .populate('customer.customerId')
      .exec();
    return result;
  };

  // update order service
  readonly updateOrder = async (
    id: string,
    payload: Partial<IOrder>
  ): Promise<IOrder | null> => {
    // check already Order exit, if not throw error
    const isExitOrder = await this.#OrderModel.findById({ _id: id });
    if (!isExitOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!');
    }

    const { ...updatedOrderData }: Partial<IOrder> = payload;

    // update the order
    let result = null;

    if (Object.keys(updatedOrderData).length) {
      result = await this.#OrderModel.findOneAndUpdate(
        { _id: id },
        { ...updatedOrderData },
        {
          new: true,
        }
      );
    }

    return result;
  };

  // order tracking status
  readonly updateOrderStatusTracking = async (
    id: string,
    payload: IOrderTacking
  ) => {
    // check already Order exit, if not throw error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isExitOrder: any = await this.#OrderModel.findById({ _id: id });
    if (!isExitOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!');
    }

    const { trackingInfo } = payload;

    const updateOrderTracking: Partial<IOrderTacking> = {};

    // update tracking info
    if (trackingInfo && Object.keys(trackingInfo)?.length > 0) {
      Object.keys(trackingInfo).map(key => {
        const trackingInfoKey =
          `trackingInfo.${key}` as keyof Partial<IOrderTacking>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (updateOrderTracking as any)[trackingInfoKey] =
          trackingInfo[key as keyof typeof trackingInfo];
      });
    }

    // check user delivered before shipped, if it is, throw error
    if (
      payload?.orderHistory?.status === 'delivered' &&
      !isExitOrder?.orderHistory?.[1]?.isDone
    ) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Without Shipped, we can not move to be delivered!'
      );
    }

    // update order history
    const orderHistory = isExitOrder?.orderHistory?.map(
      (oh: { status: string; timestamp: string; isDone: boolean }) => {
        if (oh?.status === payload?.orderHistory?.status) {
          return {
            status: payload?.orderHistory?.status,
            timestamp: `${new Date()}`,
            isDone: true,
          };
        } else {
          return {
            status: oh?.status,
            timestamp: oh?.timestamp,
            isDone: oh?.isDone,
          };
        }
      }
    );

    const result = {
      totalDeliveryTime: 0,
      updateResult: null,
    };

    // update the order
    result.updateResult = await this.#OrderModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          orderHistory: orderHistory,
          ...updateOrderTracking,
        },
      },
      {
        new: true,
      }
    );

    // send email to customer with email template and total delivered time
    if (
      payload?.orderHistory?.status === 'delivered' &&
      isExitOrder?.orderHistory?.[2]?.isDone
    ) {
      // get orderedTimestamp and delivered Timestamp
      const orderedTimestamp = isExitOrder?.orderHistory?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (history: any) => history.status === 'ordered'
      )?.timestamp;
      const deliveredTimestamp = isExitOrder?.orderHistory?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (history: any) => history.status === 'delivered'
      )?.timestamp;

      const orderHours = new Date(orderedTimestamp).getHours();
      const deliveredHours = new Date(deliveredTimestamp).getHours();

      if (deliveredHours && orderHours) {
        result.totalDeliveryTime = deliveredHours - orderHours;
      }
    }

    return result;
  };

  // delete order service
  readonly deleteOrder = async (payload: string) => {
    // check already order exit, if not throw error
    const isExitOrder = await this.#OrderModel.findById({ _id: payload });
    if (!isExitOrder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found!');
    }

    // delete the order
    const result = await this.#OrderModel.findByIdAndDelete(payload);
    return result;
  };
}

export const OrderService = new OrderServiceClass();
