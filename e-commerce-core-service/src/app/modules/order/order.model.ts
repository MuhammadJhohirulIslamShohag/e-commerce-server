import { Schema, model } from 'mongoose';

import {
  orderTrackingStatus,
  paymentBy,
  paymentStatus,
} from './order.constant';
import { OrderModel, IOrder } from './order.interface';

// order schema
const orderSchema = new Schema<IOrder, OrderModel>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
        color: String,
        size: String,
      },
    ],
    paymentIntents: Schema.Types.Mixed,
    orderStatus: {
      type: String,
      default: 'Not Processed',
      enum: paymentStatus,
    },
    paymentBy: {
      type: String,
      default: 'Stripe',
      enum: paymentBy,
    },
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    trackingInfo: {
      title: {
        type: String,
      },
      courier: {
        type: String,
      },
      trackingNumber: {
        type: String,
      },
    },
    orderHistory: [
      {
        status: {
          type: String,
          enum: orderTrackingStatus,
          default: 'ordered',
        },
        timestamp: {
          type: String,
        },
        isDone: {
          type: Boolean,
        },
      },
    ],
    billingAddress: {
      type: {
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        company: {
          type: String,
        },
        address1: {
          type: String,
        },
        address2: {
          type: String,
        },
        city: {
          type: String,
        },
        postCode: {
          type: String,
        },
        country: {
          type: String,
        },
        state: {
          type: String,
        },
        phoneNumber: {
          type: String,
        },
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// order model
const Order = model<IOrder, OrderModel>('Order', orderSchema);

export default Order;
