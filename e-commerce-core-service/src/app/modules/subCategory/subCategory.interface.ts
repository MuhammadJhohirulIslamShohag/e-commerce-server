import { Model, Types } from 'mongoose'
import { IFile } from '../../interfaces'

// sub category interface model type
export type ISubCategory = {
  name: string
  imageURL: string
  categories: [
    {
      categoryId: Types.ObjectId
    }
  ]
}

// create sub category interface model type
export type ICreateSubCategory = {
  name: string
  imageURL: IFile
  categories: [
    {
      categoryId: Types.ObjectId
    }
  ]
}

// sub category model type
export type SubCategoryModel = Model<ISubCategory>

