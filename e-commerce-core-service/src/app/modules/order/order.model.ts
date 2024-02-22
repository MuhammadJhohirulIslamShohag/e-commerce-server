import { Schema, model } from 'mongoose';
import validator from 'validator';

import {
  paymentMethod,
  paymentStatus,
  orderTrackingStatus,
} from './order.constant';
import { OrderModel, IOrder } from './order.interface';

// order schema
const orderSchema = new Schema<IOrder, OrderModel>(
  {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: [true, 'Please provide quantity of the product!'],
        },
        price: {
          type: Number,
          required: [true, 'Please provide price of the product!'],
        },
        originalPrice: {
          type: Number,
        },
        discount: {
          type: Number,
          required: [true, 'Please provide discount of product!'],
        },
      },
    ],
    orderId: {
      type: Number,
    },
    transactionId: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      validate: [validator.isEmail, 'Provide a valid email!'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide total amount of order!'],
    },
    netAmount: {
      type: Number,
      required: [true, 'Please provide total net amount of order!'],
    },
    deliveryCharge: {
      type: Number,
      required: [true, 'Please provide a delivery charge!'],
    },
    coupon: {
      type: String,
    },
    payment_status: {
      type: String,
      enum: paymentStatus,
      default: 'processing',
      required: [true, 'Please provide payment status of the order!'],
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
    payment_method: {
      type: String,
      enum: paymentMethod,
      required: [true, 'Please provide payment method of the order!'],
    },
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
    customer: {
      customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide customer info of the order!'],
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
