import { Schema, model } from 'mongoose';

import { orderTrackingStatus, paymentStatus } from './order.constant';
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
      fullName: {
        type: String,
      },
      addressLine1: {
        type: String,
      },
      addressLine2: {
        type: String,
      },
      city: {
        type: String,
      },
      stateProvince: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      country: {
        type: String,
      },
      phoneNumber: {
        type: String,
        validate: {
          validator: function (v: string) {
            return /^\+?[1-9]\d{1,14}$/.test(v);
          },
          message: props => `${props.value} is not a valid contact number!`,
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
