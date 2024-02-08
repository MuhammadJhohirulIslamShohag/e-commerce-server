/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'
import { IOffer } from '../offer/offer.interface'

// banner interface model type
export type IBanner = {
  imageURL: string
  offer: Types.ObjectId | IOffer
}

// banner model type
export type BannerModel = Model<IBanner>
