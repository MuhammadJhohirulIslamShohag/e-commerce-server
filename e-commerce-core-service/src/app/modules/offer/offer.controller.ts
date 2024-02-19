import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { OfferService } from './offer.service';
import catchAsync from '../../shared/catchAsync';
import ApiError from '../../errors/ApiError';
import responseReturn from '../../shared/responseReturn';
import { validateRequireFields } from '../../shared/validateRequireFields';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';

class OfferControllerClass {
  #OfferService: typeof OfferService;

  constructor(service: typeof OfferService) {
    this.#OfferService = service;
  }

  // create offer controller
  readonly createOffer = catchAsync(async (req: Request, res: Response) => {
    const { name, startDate, endDate, ...other } = req.body;

    // validate body data
    await validateRequireFields({ name, startDate, endDate });

    // offer image file
    const offerImageFile = await ImageUploadHelpers.imageFileValidate(
      req,
      'offerImage',
      'offer'
    );

    // sub category data
    const offerObjStructure = {
      name,
      startDate,
      endDate,
      imageURL: offerImageFile,
      ...other,
    };



    const result = await this.#OfferService.createOffer(offerObjStructure);

    // if not created offer, throw error
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Offer Create Failed!`);
    }

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offer Created Successfully!',
      data: result,
    });
  });

  // get all offers controller
  readonly allOffers = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#OfferService.allOffers(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Offers Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get single offer user controller
  readonly getSingleOffer = catchAsync(async (req: Request, res: Response) => {
    const offerId = req.params.id;
    
    const result = await this.#OfferService.getSingleOffer(offerId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Offer Retrieved Successfully!',
      data: result,
    });
  });

  // update offer controller
  readonly updateOffer = catchAsync(async (req: Request, res: Response) => {
    const offerId = req.params.id;
    const { ...updateOfferData } = req.body;

    const result = await this.#OfferService.updateOffer(
      offerId,
      updateOfferData
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offer Updated Successfully!',
      data: result,
    });
  });

  // delete offer controller
  readonly deleteOffer = catchAsync(async (req: Request, res: Response) => {
    const offerId = req.params.id;

    const result = await this.#OfferService.deleteOffer(offerId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offer Removed Successfully!',
      data: result,
    });
  });
}

export const OfferController = new OfferControllerClass(OfferService);
