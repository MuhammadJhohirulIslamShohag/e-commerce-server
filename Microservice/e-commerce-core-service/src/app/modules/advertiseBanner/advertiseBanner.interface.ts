import { Model } from 'mongoose'
import { IFile } from '../../interfaces'

// advertise banner interface model type
export type IAdvertiseBanner = {
  name: string
  position: number
  shareURL: string
  duration: string
  startDate: string
  endDate: string
  imageURL: string
}

// create advertise banner interface type
export type ICreateAdvertiseBanner = {
  name: string
  position: number
  shareURL: string
  duration: string
  startDate: string
  endDate: string
  imageURL: IFile
}

// advertise banner model type
export type AdvertiseBannerModel = Model<IAdvertiseBanner>

// advertise banner filterable filed
export type AdvertiseBannerFilters = {
  searchTerm?: string
}
