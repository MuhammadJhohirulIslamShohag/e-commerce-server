import { Schema, model } from 'mongoose';

import { CartModel, ICart } from './cart.interface';

const cartSchema = new Schema<ICart, CartModel>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        count: Number,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalPriceAfterDiscount: Number,
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// cart model
const Cart = model<ICart, CartModel>('Carts', cartSchema);

export default Cart;
