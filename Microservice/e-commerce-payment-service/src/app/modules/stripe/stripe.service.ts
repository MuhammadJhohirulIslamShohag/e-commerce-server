import axios from 'axios';
import httpStatus from 'http-status';

import ApiError from '../../../errors/ApiError';
import config from '../../../config';

import { IStripe } from './stripe.interface';
import { stripe } from '../../../shared/stripe';

class StripeServiceClass {
  // create stripe service
  readonly intentsCreateStripe = async (payload: IStripe, userId: string) => {
    const { isCouped } = payload;

    // getting who payment or order
    const user = await axios.get(
      `${config.user_url_auth_service_endpoint}/users/${userId}`
    );

    if (!user?.data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found!');
    }

    // getting total price before discount
    const cart = await axios.get(
      `${config.core_service_endpoint}/carts/${userId}`
    );
    const { cartTotal, totalPriceAfterDiscount, products } = cart.data;

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
