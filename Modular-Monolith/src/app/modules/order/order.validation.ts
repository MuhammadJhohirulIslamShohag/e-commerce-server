import { z } from 'zod';
import {
  orderTrackingStatus,
  paymentMethod,
  paymentStatus,
} from './order.constant';

const orderCreateZodSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        productId: z.string({
          required_error: 'Product Id is Required!',
        }),
        quantity: z.number({
          required_error: 'Quantity is Required!',
        }),
      })
    ),
    deliveryCharge: z.number({
      required_error: 'Delivery Charge is Required!',
    }),
    payment_status: z
      .enum([...paymentStatus] as [string, ...string[]])
      .optional(),
    coupon: z.string().optional(),
    email: z.string().email(),
    order_tracking_status: z
      .enum([...orderTrackingStatus] as [string, ...string[]])
      .optional(),
    payment_method: z.enum([...paymentMethod] as [string, ...string[]], {
      required_error: 'Payment method is Required!',
    }),
    orderedBy: z.string({
      required_error: 'Ordered By is Required!',
    }),

    billingAddress: z.object({
      firstName: z.string({
        required_error: 'First Name is Required!',
      }),
      lastName: z.string({
        required_error: 'Last Name is Required!',
      }),
      address1: z.string({
        required_error: 'Address1 is Required!',
      }),
      address2: z.string({
        required_error: 'Address1 is Required!',
      }),
      city: z.string({
        required_error: 'City is Required!',
      }),
      state: z.string({
        required_error: 'State Province is Required!',
      }),
      postCode: z.string({
        required_error: 'Postal Code is Required!',
      }),
      country: z.string({
        required_error: 'Country is Required!',
      }),
      phoneNumber: z.string({
        required_error: 'Phone Number is Required!',
      }),
    }),
  }),
});

const orderCashOnDeliveryZodSchema = z.object({
  body: z.object({
    isCashOnDelivery: z.boolean(),
    isCouped: z.boolean(),
    billingAddress: z.object({
      firstName: z.string({
        required_error: 'First Name is Required!',
      }),
      lastName: z.string({
        required_error: 'Last Name is Required!',
      }),
      address1: z.string({
        required_error: 'Address1 is Required!',
      }),
      address2: z.string({
        required_error: 'Address1 is Required!',
      }),
      city: z.string({
        required_error: 'City is Required!',
      }),
      state: z.string({
        required_error: 'State Province is Required!',
      }),
      postCode: z.string({
        required_error: 'Postal Code is Required!',
      }),
      country: z.string({
        required_error: 'Country is Required!',
      }),
      phoneNumber: z.string({
        required_error: 'Phone Number is Required!',
      }),
    }),
  }),
});

const orderUpdateZodSchema = z.object({
  body: z.object({
    order_tracking_status: z.enum([...orderTrackingStatus] as [
      string,
      ...string[]
    ]),
  }),
});

const orderTrackingStatusUpdateZodSchema = z.object({
  body: z.object({
    trackingInfo: z.object({
      title: z.string({
        required_error: 'Tracking Title is Required!',
      }),
      courier: z.string().optional(),
      trackingNumber: z.string().optional(),
    }),
    orderHistory: z.object({
      status: z.string({
        required_error: 'Status is Required!',
      }),
      timestamp: z.string().optional(),
      isDone: z.boolean().optional(),
    }),
  }),
});

export const OrderValidation = {
  orderCreateZodSchema,
  orderUpdateZodSchema,
  orderTrackingStatusUpdateZodSchema,
  orderCashOnDeliveryZodSchema,
};
