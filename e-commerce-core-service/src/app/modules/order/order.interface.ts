import { Model, Types } from 'mongoose'

// payment status enum type
type PaymentStatusType = 'processing' | 'succeeded' | 'canceled'

// payment method enum type
type PaymentMethodType =
  | 'online_payment'
  | 'cash_on_delivery'
  | 'pos_on_delivery'

type BillingAddress = {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  stateProvince: string
  postalCode: string
  country: string
  phoneNumber: string
}

// order interface model type
export type IOrder = {
  products: {
    productId: Types.ObjectId | string
    quantity: number
    price: number
    originalPrice: number
    discount: number
  }
  orderId: number
  transactionId: string
  email: string
  amount: number
  netAmount: number
  deliveryCharge: number
  payment_status: PaymentStatusType
  payment_method: PaymentMethodType
  trackingInfo: {
    title: string
    courier: string
    trackingNumber: string
  }
  orderHistory: {
    status: string
    timestamp: string
    isDone: boolean
  }
  billingAddress: BillingAddress
  coupon: string
  customer: {
    customerId: Types.ObjectId
  }
}

// order create interface model type
export type OrderCreate = {
  products: [
    {
      productId: Types.ObjectId | string
      quantity: number
    }
  ]
  payment_status: PaymentStatusType
  email: string
  payment_method: PaymentMethodType
  deliveryCharge: number
  billingAddress: BillingAddress
  coupon: string
  customer: {
    customerId: Types.ObjectId
  }
}

// order tracking interface type
export type IOrderTacking = {
  trackingInfo: {
    title: string
    courier: string
    trackingNumber: string
  }
  orderHistory: {
    status: string
    isDone: boolean
    timestamp: string
  }
}



// order model type
export type OrderModel = Model<IOrder>

// order filterable filed
export type OrderFilters = {
  searchTerm?: string
}
