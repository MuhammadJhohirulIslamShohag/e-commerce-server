/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'

// Coupon status enum
type StatusType = 'valid' | 'inValid'

// Coupon interface model type
export type ICoupon = {
  name: string
  code: string
  discount: number
  status: StatusType
}

// Coupon model type
export type CouponModel = Model<ICoupon>

// Coupon filterable filed
export type CouponFilters = {
  searchTerm?: string
}
