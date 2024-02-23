import httpStatus from 'http-status';
import axios from 'axios';
import { SortOrder } from 'mongoose';

import config from '../../config';
import Cart from '../cart/cart.model';
import Order from './order.model';
import Product from '../product/product.model';
import Coupon from '../coupon/coupon.model';
import ApiError from '../../errors/ApiError';

import { orderSearchableFields } from './order.constant';
import {
  OrderFilters,
  IOrder,
  IOrderTacking,
} from './order.interface';
import { paginationHelper } from '../../helpers/pagination.helper';
import { PaginationOptionType } from '../../interfaces/pagination';
import { getUniqueKey } from '../../shared/getUniqueKey';

class OrderServiceClass {
  #OrderModel;
  #ProductModel;
  #CartModel;
  #CouponModel;
  constructor() {
    this.#OrderModel = Order;
    this.#ProductModel = Product;
    this.#CartModel = Cart;
    this.#CouponModel = Coupon;
  }

  // create order service
  readonly createOrder = async (payload: any, user: string) => {
    const { paymentIntent, paymentBy } = payload;
    // who order
    const userData = await axios.get(
      `${config.user_url_auth_service_endpoint}/${user}` ||
        'https://localhost:7000/api/vi/users'
    );

    if (!userData?.data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    // which product carts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const carts: any = await this.#CartModel
      .findOne({ orderedBy: user })
      .exec();
    const { products } = carts;

    // save to the database
    await new Order({
      products,
      paymentIntents: paymentIntent,
      orderedBy: user,
      paymentBy,
    }).save();

    // decrement quantity and sold increment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bulkOption = products.map((item: any) => {
      return {
        updateOne: {
          filter: {
            _id: item.product._id,
          },
          update: {
            $inc: {
              quantity: -item.count,
              sold: +item.count,
            },
          },
        },
      };
    });

    // update
    await Product.bulkWrite(bulkOption, {});
    return { ok: true };
  };

  // create order with cash_on_delivery service
  readonly createOrderWithCashOnDelivery = async (
    payload: any,
    user: string
  ) => {
    const { isCashOnDelivery, isCoupon } = payload;

    // if isCashOnDelivery is true, it is going to process to the cash on delivery
    if (!isCashOnDelivery) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Create Cash Order is Failed!'
      );
    }

    // who payment on the cash
    const userData = await axios.get(
      `${config.user_url_auth_service_endpoint}/${user}` ||
        'https://localhost:7000/api/vi/users'
    );

    if (!userData?.data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    // which carts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userCarts: any = await this.#CartModel
      .findOne({ orderedBy: user })
      .lean();

    let finalAmount = 0;
    if (isCoupon && userCarts && userCarts?.totalPriceAfterDiscount) {
      finalAmount = userCarts?.totalPriceAfterDiscount * 100;
    } else {
      finalAmount = userCarts.cartTotal * 100;
    }

    const update = await new Order({
      products: userCarts?.products,
      paymentIntents: {
        id: getUniqueKey('ORD'),
        amount: finalAmount,
        currency: 'usd',
        payment_method_types: ['Cash'],
        status: 'succeeded',
        created: Date.now(),
      },
      orderStatus: 'Cash On Delivery',
      orderedBy: user,
    }).save();

    // increment sold and decrement quantity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bulkWrites = userCarts?.products.map((item: any) => {
      return {
        updateOne: {
          filter: {
            _id: item.product._id,
          },
          update: {
            $inc: {
              quantity: -item.count,
              sold: +item.count,
            },
          },
        },
      };
    });
    await Product.bulkWrite(bulkWrites, {});

    return { ok: true, update };
  };

  // get all orders service
  readonly allOrders = async (
    paginationOption: PaginationOptionType,
    filters: OrderFilters
  ) => {
    const { page, limit, sortBy, sortOrder, skip } =
      paginationHelper.calculatePagination(paginationOption);

    // exact search term
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    // searching specific filed with dynamic way
    if (searchTerm) {
      andConditions.push({
        $or: orderSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      });
    }

    // exact filtering with dynamic way
    if (Object.keys(filterData).length) {
      andConditions.push({
        $and: Object.entries(filterData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }

    // dynamic sorting
    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) sortConditions[sortBy] = sortOrder;

    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};

    // result of order
    const result = await this.#OrderModel
      .find(whereConditions)
      .populate('products.productId')
      .populate('customer.customerId')
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    // get total order
    const total = await this.#OrderModel.countDocuments(whereConditions);

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
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
