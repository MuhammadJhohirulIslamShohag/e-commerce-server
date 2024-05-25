/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'

// Color interface model type
export type IColor = {
  name: string
}

// Color model type
export type ColorModel = Model<IColor>

// Color filterable filed
export type ColorFilters = {
  searchTerm?: string
}
