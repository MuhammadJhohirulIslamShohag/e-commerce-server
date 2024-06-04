import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { SubCategoryService } from './subCategory.service';
import { validateRequireFields } from '../../shared/validateRequireFields';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { IFile } from '../../interfaces';

class SubCategoryControllerClass {
  #SubCategoryService: typeof SubCategoryService;

  constructor(service: typeof SubCategoryService) {
    this.#SubCategoryService = service;
  }

  // create sub category method
  readonly createSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const { name, categoryId } = req.body;

      // validate body data
      await validateRequireFields({ name, categoryId });

      // sub category image file
      const subCategoryImageFile = await ImageUploadHelpers.imageFileValidate(
        req.file as unknown as IFile,
        'subCategoryImage',
        'subCategory'
      );

      // sub category data
      const subCategoryObjStructure = {
        name,
        categoryId,
        imageURL: subCategoryImageFile,
      };

      const result = await this.#SubCategoryService.createSubCategory(
        subCategoryObjStructure
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sub Category Created Successfully!',
        data: result,
      });
    }
  );

  // get all sub categories method
  readonly allSubCategories = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#SubCategoryService.allSubCategories(req.query);

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Sub Categories Retrieved Successfully!',
        data: result.result,
        meta: result.meta,
      });
    }
  );

  // get single sub category user method
  readonly getSingleSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const subCategoryId = req.params.id;

      const result = await this.#SubCategoryService.getSingleSubCategory(
        subCategoryId
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Sub Category Retrieved Successfully!',
        data: result,
      });
    }
  );

  // update sub category method
  readonly updateSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const subCategoryId = req.params.id;
      const { ...updateSubCategoryData } = req.body;

      // check validity request payload body
      await validateRequireFields(updateSubCategoryData);

      // sub category image file
      const subCategoryImageFile =
        await ImageUploadHelpers.imageFileValidateForUpdate(
          req.file as unknown as IFile,
          'subCategoryImage',
          'subCategory'
        );

      const result = await this.#SubCategoryService.updateSubCategory(
        subCategoryId,
        updateSubCategoryData,
        subCategoryImageFile
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sub Category Updated Successfully!',
        data: result,
      });
    }
  );

  // delete sub category method
  readonly deleteSubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const subCategoryId = req.params.id;

      const result = await this.#SubCategoryService.deleteSubCategory(
        subCategoryId
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Sub Category Removed Successfully!',
        data: result,
      });
    }
  );
}

export const SubCategoryController = new SubCategoryControllerClass(
  SubCategoryService
);
