/* eslint-disable no-unused-expressions */
import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { PaginationOptionType } from '../../../interfaces/pagination'
import Banner from './banner.model'
import { IBanner } from './banner.interface'

// create banner service
const createBanner = async (payload: IBanner): Promise<IBanner | null> => {
  // check already banner exit, if not, throw error
  const isExitBanner = await Banner.findOne({ imageURL: payload?.imageURL })
  if (isExitBanner) {
    throw new ApiError(httpStatus.CONFLICT, `Banner Image Is Already Exit!`)
  }

  // create new banner
  const result = await Banner.create(payload)

  return result
}

// get all banners service
const allBanners = async (
  paginationOption: PaginationOptionType
): Promise<IGenericResponse<IBanner[]>> => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(paginationOption)

  // dynamic sorting
  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) [(sortConditions[sortBy] = sortOrder)]

  // result of banner
  const result = await Banner.find()
    .populate('offer')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  // get total banners
  const total = await Banner.countDocuments()

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

// get single banner service
const getSingleBanner = async (payload: string): Promise<IBanner | null> => {
  const result = await Banner.findById(payload).populate('offer').exec()
  return result
}

// update banner service
const updateBanner = async (
  id: string,
  payload: Partial<IBanner>
): Promise<IBanner | null> => {
  // check already banner exit, if not throw error
  const isExitBanner = await Banner.findById({ _id: id })
  if (!isExitBanner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner Image Not Found!')
  }

  const updatedBannerData: Partial<IBanner> = { ...payload }

  // update the banner
  const result = await Banner.findOneAndUpdate({ _id: id }, updatedBannerData, {
    new: true,
  })

  return result
}

// delete banner service
const deleteBanner = async (payload: string): Promise<IBanner | null> => {
  // check already banner exit, if not throw error
  const isExitBanner = await Banner.findById({ _id: payload })
  if (!isExitBanner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner Image Not Found!')
  }

  // delete the banner
  const result = await Banner.findByIdAndDelete(payload)
  return result
}

export const BannerService = {
  createBanner,
  allBanners,
  deleteBanner,
  updateBanner,
  getSingleBanner,
}
