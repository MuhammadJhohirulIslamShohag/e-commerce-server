import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { paginationOptionFields } from '../../../constants/pagination'
import ApiError from '../../../errors/ApiError'
import { IGenericResponse } from '../../../interfaces/common'
import catchAsync from '../../../shared/catchAsync'
import { pick } from '../../../shared/pick'
import responseReturn from '../../../shared/responseReturn'
import { IBanner } from './banner.interface'
import { BannerService } from './banner.service'

// create banner controller
const createBanner = catchAsync(async (req: Request, res: Response) => {
  const { ...bannerData } = req.body
  const result = await BannerService.createBanner(bannerData)

  // if not created banner, throw error
  if (!result) {
    throw new ApiError(httpStatus.CONFLICT, `Banner Image Create Failed!`)
  }

  responseReturn<IBanner | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner Image Created Successfully!',
    data: result,
  })
})

// get all banners controller
const allBanners = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationOptionFields)

  const result = await BannerService.allBanners(paginationOptions)

  responseReturn<IGenericResponse<IBanner[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Banners Image Retrieved Successfully!',
    data: result,
  })
})

// get single Banner user controller
const getSingleBanner = catchAsync(async (req: Request, res: Response) => {
  const bannerId = req.params.id
  const result = await BannerService.getSingleBanner(bannerId)

  responseReturn<IBanner | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Banner Image Retrieved Successfully!',
    data: result,
  })
})

// update banner controller
const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const bannerId = req.params.id
  const { ...updateBannerData } = req.body
  const result = await BannerService.updateBanner(bannerId, updateBannerData)

  responseReturn<IBanner | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner Image Updated Successfully!',
    data: result,
  })
})

// delete banner controller
const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const bannerId = req.params.id
  const result = await BannerService.deleteBanner(bannerId)

  responseReturn<IBanner | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner Image Removed Successfully!',
    data: result,
  })
})

export const BannerController = {
  createBanner,
  allBanners,
  updateBanner,
  getSingleBanner,
  deleteBanner,
}
