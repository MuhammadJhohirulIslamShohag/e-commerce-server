import { Schema, model } from 'mongoose'
import validator from 'validator'

import { OfferModel, IOffer } from './offer.interface'

// offer schema
const offerSchema = new Schema<IOffer, OfferModel>(
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
    details: {
      type: String,
    },
    imageURL: {
      type: String,
      validate: [validator.isURL, 'Please provide valid offer image url!'],
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

// offer model
const Offer = model<IOffer, OfferModel>('Offer', offerSchema)

export default Offer
