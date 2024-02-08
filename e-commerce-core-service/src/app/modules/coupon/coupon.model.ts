import { Schema, model } from 'mongoose'
import { couponStatus } from './coupon.constant'
import { CouponModel, ICoupon } from './coupon.interface'

// coupon schema
const couponSchema = new Schema<ICoupon, CouponModel>(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Please provide a name!'],
      minLength: [2, 'Name must be at least 3 characters'],
      maxLength: [120, 'Name is to large!'],
    },
    code: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Please provide a code!'],
    },
    discount: {
      type: Number,
    },
    status: {
      type: String,
      enum: couponStatus,
      default: 'inValid',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

// coupon model
const Coupon = model<ICoupon, CouponModel>('Coupon', couponSchema)

export default Coupon
