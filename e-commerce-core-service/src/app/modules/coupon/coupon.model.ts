import { Schema, model } from 'mongoose';
import { discountType } from './coupon.constant';
import { CouponModel, ICoupon } from './coupon.interface';

// coupon schema
const couponSchema = new Schema<ICoupon, CouponModel>(
  {
    code: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Please provide a code!'],
    },
    discountAmount: {
      type: Number,
    },
    discountType: {
      type: String,
      enum: discountType,
      default: 'Percentage',
    },
    uses: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// coupon model
const Coupon = model<ICoupon, CouponModel>('Coupon', couponSchema);

export default Coupon;
