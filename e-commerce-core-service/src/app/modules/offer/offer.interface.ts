
import { Model } from 'mongoose'
import { IFile } from '../../interfaces'

// offer interface model type
export type IOffer = {
  name: string
  startDate: string
  endDate: string
  details: string
  imageURL: string
}

// offer interface model type
export type ICreateOffer = {
  name: string
  startDate: string
  endDate: string
  details: string
  imageURL: IFile
}

// offer model type
export type OfferModel = Model<IOffer>

// offer filterable filed
export type OfferFilters = {
  searchTerm?: string
}
