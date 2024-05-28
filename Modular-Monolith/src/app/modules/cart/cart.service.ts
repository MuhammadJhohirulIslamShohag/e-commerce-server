import QueryBuilder from '../../builder/query.builder';
import Product from '../product/product.model';
import Cart from './cart.model';

import { ICreateCart } from './cart.interface';
import { cartSearchableFields } from './cart.constant';
import { IProduct } from '../product/product.interface';

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
    // checking already exist cart which to save database
    const existingCartsInUser = await this.#CartModel
      .findOne({
        orderedBy: userId,
      })
      .exec();

    // remove existing cart which already have database
    if (existingCartsInUser) {
      existingCartsInUser.deleteOne();
    }

    const products: { [key: string]: unknown }[] = [];

    for (let i = 0; i < payload?.length; i++) {
      const object: { [key: string]: unknown } = {};

      object.product = payload?.[i]?._id;
      object.count = payload?.[i]?.count;

      const priceOfProduct = (await this.#ProductModel
        .findOne({ _id: payload?.[i]?._id })
        .select('price discount')
        .lean()) as IProduct;

      const discountPrice = Math.ceil(
        priceOfProduct?.price * (priceOfProduct?.discount / 100)
      );
      const netPrice =
        Math.ceil(priceOfProduct?.price - discountPrice) * payload?.[i].count;
      object.price = netPrice;

      // push object products array
      products.push(object);
    }

    // calculate cart total
    let cartTotal = 0;
    for (let i = 0; i < products?.length; i++) {
      cartTotal += products?.[i]?.price as number;
    }
    // creating new cart
    await new this.#CartModel({
      products,
      cartTotal,
      orderedBy: userId,
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

  // get user carts service
  readonly userCarts = async (payload: string) => {
    // checking already exist cart which to save database
    const carts = await this.#CartModel
      .findOne({
        orderedBy: payload,
      })
      .populate('products.product')
      .exec();

    return carts;
  };

  // delete cart service
  readonly deleteCart = async (payload: string) => {
    // delete cart which delete the the database
    const deleteCart = await Cart.findOneAndDelete({
      orderedBy: payload,
    }).exec();

    return { deleteCart, ok: true };
  };
}

export const CartService = new CartServiceClass();
