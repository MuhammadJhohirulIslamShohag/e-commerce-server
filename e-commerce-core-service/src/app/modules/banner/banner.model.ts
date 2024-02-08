/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose'
import validator from 'validator'
import { BannerModel, IBanner } from './banner.interface'

// banners schema
const BannerSchema = new Schema<IBanner, BannerModel>(
  {
    imageURL: {
      type: String,
      required: true,
      validate: [validator.isURL, 'Please provide valid banner url'],
    },
    offer: {
      ref: 'Offer',
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

// banners model
const Banner = model<IBanner, BannerModel>('Banner', BannerSchema)

export default Banner
