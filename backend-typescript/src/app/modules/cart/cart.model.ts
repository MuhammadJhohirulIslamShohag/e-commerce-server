import { Schema, model } from 'mongoose';
import { ICart, CartModel } from './cart.interface';

const CartSchema = new Schema<ICart, CartModel>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalPriceAfterDiscount: Number,
    CartedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.createCartAt = ret.createdAt;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
      },
    },
  }
);

const Cart = model<ICart, CartModel>('Cart', CartSchema);

export default Cart;
