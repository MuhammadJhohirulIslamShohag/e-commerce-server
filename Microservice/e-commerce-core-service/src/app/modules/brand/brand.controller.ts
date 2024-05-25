import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { BrandService } from './brand.service';
import { validateRequireFields } from '../../shared/validateRequireFields';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';

class BrandControllerClass {
  #BrandService: typeof BrandService;

  constructor(service: typeof BrandService) {
    this.#BrandService = service;
  }

  // create brand controller
  readonly createBrand = catchAsync(async (req: Request, res: Response) => {
    const { name, email, description, files, ...other } = req.body;

    // validate body data
    await validateRequireFields({ name, email, description });

    // brand image file
    const brandImageFile = await ImageUploadHelpers.imageFileValidate(
      files,
      'brandImage',
      'brand'
    );

    // brand data
    const brandObjStructure = {
      name,
      email,
      description,
      imageURL: brandImageFile,
      ...other,
    };

    const result = await this.#BrandService.createBrand(brandObjStructure);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Brand Created Successfully!',
      data: result,
    });
  });

  // get all brands controller
  readonly allBrands = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#BrandService.allBrands(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Brands Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get single brand user controller
  readonly getSingleBrand = catchAsync(async (req: Request, res: Response) => {
    const brandId = req.params.id;

    const result = await this.#BrandService.getSingleBrand(brandId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Brand Retrieved Successfully!',
      data: result,
    });
  });

  // update brand controller
  readonly updateBrand = catchAsync(async (req: Request, res: Response) => {
    const brandId = req.params.id;
    const { files, ...updateBrandData } = req.body;

    // check validity request payload body
    await validateRequireFields(updateBrandData);

    // advertise banner image file
    const brandImageFile = await ImageUploadHelpers.imageFileValidateForUpdate(
      files,
      'brandImage',
      'brand'
    );

    const result = await this.#BrandService.updateBrand(
      brandId,
      updateBrandData,
      brandImageFile
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Brand Updated Successfully!',
      data: result,
    });
  });

  // delete brand controller
  readonly deleteBrand = catchAsync(async (req: Request, res: Response) => {
    const brandId = req.params.id;

    const result = await this.#BrandService.deleteBrand(brandId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Brand Removed Successfully!',
      data: result,
    });
  });
}

export const BrandController = new BrandControllerClass(BrandService);
