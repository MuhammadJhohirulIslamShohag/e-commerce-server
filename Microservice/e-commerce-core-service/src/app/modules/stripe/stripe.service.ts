import Cart from '../cart/cart.model';
import { stripe } from '../../shared/stripe';
import { IStripe } from './stripe.interface';
import { ICart } from '../cart/cart.interface';

class StripeServiceClass {
  #CartModel;
  
  constructor() {
    this.#CartModel = Cart;
  }
  // create stripe service
  readonly intentsCreateStripe = async (payload: IStripe, userId: string) => {
    const { isCouped } = payload;

    // getting total price before discount
    const cart = await this.#CartModel
      .findOne({ orderedBy: userId })
      .populate('products.product')
      .exec();

    const { cartTotal, totalPriceAfterDiscount, products } = cart as ICart;

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
      product: products.length && products,
    };
  };
}

export const StripeService = new StripeServiceClass();
