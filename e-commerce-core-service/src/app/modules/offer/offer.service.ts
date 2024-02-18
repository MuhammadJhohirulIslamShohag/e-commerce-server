/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions */
import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { PaginationOptionType } from '../../../interfaces/pagination'
import { offerSearchableFields } from './offer.constant'
import { OfferFilters, IOffer } from './offer.interface'
import Offer from './offer.model'

// create Offer service
const createOffer = async (payload: IOffer): Promise<IOffer | null> => {
  // check already Offer exit, if not, throw error
  const isExitOffer = await Offer.findOne({ name: payload?.name })

  // check already Offer exit, throw error
  if (isExitOffer) {
    throw new ApiError(httpStatus.CONFLICT, 'Offer already Exit!')
  }

  let result = null

  // checking date and compare
  if (payload.startDate && payload.endDate) {
    if (new Date(payload.startDate) >= new Date(payload.endDate)) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Offer Date should be greater than start date!'
      )
    }

    result = await Offer.create(payload)
  }
  return result
}

// get all Offers service
const allOffers = async (
  paginationOption: PaginationOptionType,
  filters: OfferFilters
): Promise<IGenericResponse<IOffer[]>> => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(paginationOption)

  // exact search term
  const { searchTerm, ...filterData } = filters

  const andConditions = []

  // searching specific filed with dynamic way
  if (searchTerm) {
    andConditions.push({
      $or: offerSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  // exact filtering with dynamic way
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  // dynamic sorting
  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) [(sortConditions[sortBy] = sortOrder)]

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  // result of Offer
  const result = await Offer.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  // get total Offer
  const total = await Offer.countDocuments(whereConditions)

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

// get single Offer service
const getSingleOffer = async (payload: string): Promise<IOffer | null> => {
  const result = await Offer.findById(payload).exec()
  return result
}

// update Offer service
const updateOffer = async (
  id: string,
  payload: Partial<IOffer>
): Promise<IOffer | null> => {
  // check already Offer exit, if not throw error
  const isExitOffer = await Offer.findById({ _id: id })
  if (!isExitOffer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offer Not Found!')
  }

  const { startDate, endDate, }: Partial<IOffer> = payload

  // if you want to update start date
  if (startDate && !endDate) {
    if (new Date(startDate) >= new Date(isExitOffer.endDate)) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Offer Date should be greater than start date!'
      )
    }
  }

  // if you want to update end date
  if (endDate && !startDate) {
    if (new Date(isExitOffer.startDate) >= new Date(endDate)) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Offer Date should be greater than start date!'
      )
    }
  }

  // if you want to update both date
  if (endDate && startDate) {
    if (new Date(startDate) >= new Date(endDate)) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Offer Date should be greater than start date!'
      )
    }
  }

  // update the Offer
  let result = null

  if (Object.keys(payload).length) {
    result = await Offer.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    })
  }

  return result
}

// delete Offer service
const deleteOffer = async (payload: string): Promise<IOffer | null> => {
  // check already Offer exit, if not throw error
  const isExitOffer = await Offer.findById({ _id: payload })
  if (!isExitOffer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offer Not Found!')
  }

  // delete the Offer
  const result = await Offer.findByIdAndDelete(payload)
  return result
}

export const OfferService = {
  createOffer,
  allOffers,
  deleteOffer,
  updateOffer,
  getSingleOffer,
}
