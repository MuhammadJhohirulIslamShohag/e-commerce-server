import { Model } from 'mongoose';

// Discount Type Enum
type DiscountType = 'Fixed' | 'Percentage';

// Coupon interface model type
export type ICoupon = {
  code: string;
  uses: number;
  discountAmount: number;
  isActive: boolean;
  discountType: DiscountType;
  expiresAt: Date;
};

// Coupon model type
export type CouponModel = Model<ICoupon>;

// Coupon filterable filed
export type CouponFilters = {
  searchTerm?: string;
};
