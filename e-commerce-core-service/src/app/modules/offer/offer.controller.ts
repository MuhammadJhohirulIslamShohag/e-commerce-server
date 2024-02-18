import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { paginationOptionFields } from '../../../constants/pagination'
import ApiError from '../../../errors/ApiError'
import { IGenericResponse } from '../../../interfaces/common'
import catchAsync from '../../../shared/catchAsync'
import { pick } from '../../../shared/pick'
import responseReturn from '../../../shared/responseReturn'
import { offerFilterableFields } from './offer.constant'
import { IOffer } from './offer.interface'
import { OfferService } from './offer.service'

// create Offer controller
const createOffer = catchAsync(async (req: Request, res: Response) => {
  const { ...offerData } = req.body
  
  const result = await OfferService.createOffer(offerData)

  // if not created Offer, throw error
  if (!result) {
    throw new ApiError(httpStatus.CONFLICT, `Offer Create Failed!`)
  }

  responseReturn<IOffer | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer Created Successfully!',
    data: result,
  })
})

// get all Offers controller
const allOffers = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationOptionFields)
  const filters = pick(req.query, offerFilterableFields)

  const result = await OfferService.allOffers(paginationOptions, filters)

  responseReturn<IGenericResponse<IOffer[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Offers Retrieved Successfully!',
    data: result,
  })
})

// get single Offer user controller
const getSingleOffer = catchAsync(async (req: Request, res: Response) => {
  const offerId = req.params.id
  const result = await OfferService.getSingleOffer(offerId)

  responseReturn<IOffer | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Offer Retrieved Successfully!',
    data: result,
  })
})

// update Offer controller
const updateOffer = catchAsync(async (req: Request, res: Response) => {
  const offerId = req.params.id
  const { ...updateOfferData } = req.body
  const result = await OfferService.updateOffer(offerId, updateOfferData)

  responseReturn<IOffer | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer Updated Successfully!',
    data: result,
  })
})

// delete Offer controller
const deleteOffer = catchAsync(async (req: Request, res: Response) => {
  const offerId = req.params.id
  const result = await OfferService.deleteOffer(offerId)

  responseReturn<IOffer | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer Removed Successfully!',
    data: result,
  })
})

export const OfferController = {
  createOffer,
  allOffers,
  updateOffer,
  getSingleOffer,
  deleteOffer,
}
