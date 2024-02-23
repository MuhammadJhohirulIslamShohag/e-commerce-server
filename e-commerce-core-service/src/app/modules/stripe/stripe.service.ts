import axios from 'axios';
import httpStatus from 'http-status';

import ApiError from '../../errors/ApiError';
import Cart from '../cart/cart.model';
import config from '../../config';

import { stripe } from '../../shared/stripe';
import { IStripe } from './stripe.interface';

class StripeServiceClass {
  #CartModel;
  constructor() {
    this.#CartModel = Cart;
  }
  // create Stripe service
  readonly intentsCreateStripe = async (payload: IStripe, userId: string) => {
    const { isCouped } = payload;
    // getting who payment or order
    const user = await axios.get(
      `${config.user_url_auth_service_endpoint}/${userId}` ||
        'https://localhost:7000/api/vi/users'
    );

    if (!user?.data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    // getting total price before discount
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cart: any = await this.#CartModel
      .findOne({ orderedBy: userId })
      .exec();
    const { cartTotal, totalPriceAfterDiscount, products } = cart;

    // checking order amount based on couped
    let orderAmount = 0;
    if (isCouped && totalPriceAfterDiscount !== null) {
      orderAmount = totalPriceAfterDiscount * 100;
    } else {
      orderAmount = cartTotal * 100;
    }

    // create a payment intent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      cartTotal,
      totalPriceAfterDiscount,
      payable: orderAmount,
      product: products.length && products[0],
    };
  };
}

export const StripeService = new StripeServiceClass();
