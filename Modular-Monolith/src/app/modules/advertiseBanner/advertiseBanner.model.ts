/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose'
import validator from 'validator'
import { AdvertiseBannerModel, IAdvertiseBanner } from './advertiseBanner.interface'

// AdvertiseBanner schema
const advertiseBannerSchema = new Schema<IAdvertiseBanner, AdvertiseBannerModel>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'Please provide a name!'],
      minLength: [2, 'Name must be at least 3 characters'],
    },
    startDate: {
      type: String,
      required: [true, 'Please provide a start date!'],
    },
    endDate: {
      type: String,
      required: [true, 'Please provide a end date!'],
    },
    duration: {
      type: String,
      required: [true, 'Please provide a duration!'],
    },
    shareURL: {
      type: String,
    },
    position: {
      type: Number,
    },
    imageURL: {
      type: String,
      validate: [validator.isURL, 'Please provide valid AdvertiseBanner image url!'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

// AdvertiseBanner model
const AdvertiseBanner = model<IAdvertiseBanner, AdvertiseBannerModel>('AdvertiseBanner', advertiseBannerSchema)

export default AdvertiseBanner
