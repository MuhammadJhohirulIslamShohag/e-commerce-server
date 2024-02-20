/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Types } from 'mongoose'
import { IBrand } from '../brand/brand.interface'
import { IColor } from '../color/color.interface'
import { ISize } from '../size/size.interface'
import { ICategory } from '../category/category.interface'
import { ISubCategory } from '../subCategory/subCategory.interface'
import { IReview } from '../review/review.interface'

// Product status
type ProductStatus = 'available' | 'discontinue' | 'upcoming'

// Product interface
export type IProduct = {
  name: string
  metaTitle: string
  description: string
  price: number
  discount: number
  clickedProductCount: number
  quantity: number
  imageURL: [string]
  isFeatured: boolean
  status: ProductStatus
  reviews: {
    email: string
    id?: string
    reviewId: Types.ObjectId | IReview
  }
  category: {
    name: string
    categoryId: Types.ObjectId | ICategory
  }
  keyFeatures: any
  subCategories: [
    {
      name: string
      id?: string
      subCategoryId: Types.ObjectId | ISubCategory
    }
  ]
  brand: {
    name: string
    brandId: Types.ObjectId | IBrand
  }
  color: {
    name: string
    colorId: Types.ObjectId | IColor
  }
  size: {
    name: string
    sizeId: Types.ObjectId | ISize
  }
}

// Product model
export type ProductModel = Model<IProduct>

// Product filterable filed
export type ProductFilters = {
  searchTerm?: string
  minPrice?: string
  maxPrice?: string
}

// Product review data
export type ProductReviewDataType = {
  rating: string
  review: {
    email: string
    userId: string
    comment: string
  }
}

// Product question data
export type ProductQuestionDataType = {
  email?: string
  userId: string
  question: string
  answer: string
}

// Product Sub Category data
export type ProductSubCategoryDataType = {
  name: string
  description: string
  imageURL: string
}
