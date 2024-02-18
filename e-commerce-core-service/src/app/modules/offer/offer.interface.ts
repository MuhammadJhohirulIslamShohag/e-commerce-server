/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'

// offer interface model type
export type IOffer = {
  name: string
  startDate: string
  endDate: string
  details: string
  imageURL: string
}

// offer model type
export type OfferModel = Model<IOffer>

// offer filterable filed
export type OfferFilters = {
  searchTerm?: string
}
