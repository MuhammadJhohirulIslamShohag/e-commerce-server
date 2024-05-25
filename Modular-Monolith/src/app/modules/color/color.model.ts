/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose'
import { IColor, ColorModel } from './color.interface'

// Color schema
const colorSchema = new Schema<IColor, ColorModel>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Please provide a color name!'],
      minLength: [3, 'Name must be at least 3 characters'],
      maxLength: [120, 'Name is to large!'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

// Color model
const Color = model<IColor, ColorModel>('Color', colorSchema)

export default Color
