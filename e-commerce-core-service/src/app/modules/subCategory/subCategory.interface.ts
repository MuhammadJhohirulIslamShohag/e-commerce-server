import { Model, Types } from 'mongoose'

// sub category interface model type
export type ISubCategory = {
  name: string
  description: string
  imageURL: string
  categories: [
    {
      categoryId: Types.ObjectId
    }
  ]
}

// sub category model type
export type SubCategoryModel = Model<ISubCategory>

