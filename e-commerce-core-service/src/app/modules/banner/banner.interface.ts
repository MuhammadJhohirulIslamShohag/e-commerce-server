import { Model, Types } from 'mongoose'
import { IOffer } from '../offer/offer.interface'
import { IFile } from '../../interfaces'

// banner interface model type
export type IBanner = {
  imageURL: string
  offer: Types.ObjectId | IOffer
}

export type ICreateBanner = {
  imageURL: IFile
  offer: Types.ObjectId | IOffer
}

// banner model type
export type BannerModel = Model<IBanner>
