/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'

// Size interface model type
export type ISize = {
  name: string
}

// Size model type
export type SizeModel = Model<ISize>

// Size filterable filed
export type SizeFilters = {
  searchTerm?: string
}
