import { Types } from 'mongoose';
import httpStatus from 'http-status';
import axios from 'axios';

import config from '../../config';
import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import Product from '../product/product.model';
import Cart from './cart.model';

import { ICreateCart } from './cart.interface';
import { cartSearchableFields } from './cart.constant';

class CartServiceClass {
  #CartModel;
  #ProductModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#CartModel = Cart;
    this.#ProductModel = Product;
    this.#QueryBuilder = QueryBuilder;
  }
  // create Cart service
  readonly createCart = async (payload: ICreateCart[], userId: string) => {
    // finding user who save order cart into the database
    const user = await axios.get(
      `${config.user_url_auth_service_endpoint}/${userId}` ||
        'https://localhost:7000/api/vi/users'
    );

    if (!user?.data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    // checking already exist cart which to save database
    const existingCartsInUser = await this.#CartModel
      .findOne({
        orderedBy: user?.data?._id,
      })
      .exec();

    // remove existing cart which already have database
    if (existingCartsInUser) {
      existingCartsInUser.deleteOne();
    }

    const products = [];
    for (let i = 0; i < payload.length; i++) {
      const object: {
        product?: Types.ObjectId | string;
        count?: number;
        color?: string;
        size?: string;
        price?: number;
      } = {};

      object.product = payload[i]._id;
      object.count = payload[i].count;
      object.color = payload[i].color;
      object.size = payload[i].size;
      
      const priceOfProduct = await this.#ProductModel
        .findOne({ _id: payload?.[i]._id })
        .select('price')
        .lean();
      object.price = priceOfProduct?.price;

      // push object products array
      products.push(object);
    }

    // calculate cart total
    let cartTotal = 0;
    for (let i = 0; i < payload.length; i++) {
      cartTotal += payload[i].price * payload[i].count;
    }
    // creating new cart
    await new this.#CartModel({
      products,
      cartTotal,
      orderedBy: user?.data?._id,
    }).save();

    return { ok: true };
  };

  // get all carts service
  readonly allCarts = async (query: Record<string, unknown>) => {
    const cartQuery = new this.#QueryBuilder(this.#CartModel.find(), query)
      .search(cartSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of cart
    const result = await cartQuery.modelQuery;

    // get meta cart
    const meta = await cartQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // delete cart service
  readonly deleteCart = async (payload: string) => {
    // to get user who delete the cart
    const user = await axios.get(
      `${config.user_url_auth_service_endpoint}/${payload}` ||
        'https://localhost:7000/api/vi/users'
    );

    if (!user?.data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    // delete cart which delete the the database
    const deleteCart = await Cart.findOneAndDelete({
      orderedBy: payload,
    }).exec();

    return { deleteCart, ok: true };
  };
}

export const CartService = new CartServiceClass();
