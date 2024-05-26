import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';
import ApiError from '../../errors/ApiError';

import { ProductService } from './product.service';
import { pick } from '../../shared/pick';
import { paginationOptionFields } from '../../constants/pagination';
import { ImageUploadHelpers } from '../../helpers/image-upload.helper';
import { validateRequireFields } from '../../shared/validateRequireFields';
import { productFilterableFields } from './product.constant';
import { TFileRequestBody } from '../../interfaces/common';

class ProductControllerClass {
  #ProductService: typeof ProductService;

  constructor(service: typeof ProductService) {
    this.#ProductService = service;
  }

  // create product controller
  readonly createProduct = catchAsync(async (req: Request, res: Response) => {
    const {
      brand,
      sizes,
      colors,
      subCategories,
      category,
      ...productData
    } = req.body;

    // check validity request payload body
    await validateRequireFields(productData);

    // validate brand data
    if (Object.keys(JSON.parse(brand))?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Brand is required!');
    }

    // validate color data
    if (JSON.parse(colors)?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Color is required!');
    }

    // validate size data
    if (JSON.parse(sizes)?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Size is required!');
    }
    // validate category data
    if (Object.keys(JSON.parse(category))?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category is required!');
    }
    // validate sub categories data
    if (JSON.parse(subCategories)?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Sub Categories is required!');
    }

    // product image file
    const productImageFile = await ImageUploadHelpers.imageFilesValidate(
      req.files as unknown as TFileRequestBody,
      'productImage',
      'product'
    );

    const productDataStructure = {
      ...productData,
      imageURLs: productImageFile,
      price: JSON.parse(productData.price),
      discount: JSON.parse(productData.discount),
      quantity: JSON.parse(productData.quantity),
      isFeatured: JSON.parse(productData.isFeatured),
      brand: JSON.parse(brand),
      sizes: JSON.parse(sizes).map((str: string) => JSON.parse(str)),
      colors: JSON.parse(colors).map((str: string) => JSON.parse(str)),
      subCategories: JSON.parse(subCategories).map((str: string) =>
        JSON.parse(str)
      ),
      category: JSON.parse(category),
    };

    const result = await this.#ProductService.createProduct(
      productDataStructure
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product Created Successfully!',
      data: result,
    });
  });

  // get all product controller
  readonly allProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#ProductService.allProducts(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Products Retrieved Successfully!',
      meta: result.meta,
      data: result.result,
    });
  });

  // get all products by filters controller
  readonly getProductsByFilter = catchAsync(
    async (req: Request, res: Response) => {
      const paginationOptions = pick(req.query, paginationOptionFields);
      const filters = pick(req.query, productFilterableFields);

      const result = await this.#ProductService.getProductsByFilter(
        paginationOptions,
        filters
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Products Retrieved Successfully!',
        meta: result.meta,
        data: result.data,
      });
    }
  );

  // get single product  controller
  readonly getSingleProduct = catchAsync(
    async (req: Request, res: Response) => {
      const productId = req.params.id;
      const result = await this.#ProductService.getSingleProduct(productId);
      
      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Product Retrieved Successfully!',
        data: result,
      });
    }
  );

  // update product controller
  readonly updateProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.id;

    const {
      brand,
      sizes,
      colors,
      subCategories,
      category,
      ...productData
    } = req.body;

    // check validity request payload body
    await validateRequireFields(productData);

    // validate brand data
    if (Object.keys(JSON.parse(brand))?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Brand is required!');
    }

    // validate color data
    if (JSON.parse(colors)?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Color is required!');
    }

    // validate size data
    if (JSON.parse(sizes)?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Size is required!');
    }
    // validate category data
    if (Object.keys(JSON.parse(category))?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category is required!');
    }
    // validate sub categories data
    if (JSON.parse(subCategories)?.length < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Sub Categories is required!');
    }

    // product image file
    const productImageFile =
      await ImageUploadHelpers.imageFilesValidateForUpdate(
        req.files as unknown as TFileRequestBody,
        'productImage',
        'product'
      );

    const productDataStructure = {
      ...productData,
      price: Number(JSON.parse(productData.price)),
      discount: Number(JSON.parse(productData.discount)),
      quantity: Number(JSON.parse(productData.quantity)),
      isFeatured: Boolean(JSON.parse(productData.isFeatured)),
      imageURLs: JSON.parse(productData.imageURLs),
      brand: JSON.parse(brand),
      sizes: JSON.parse(sizes).map((str: string) => JSON.parse(str)),
      colors: JSON.parse(colors).map((str: string) => JSON.parse(str)),
      subCategories: JSON.parse(subCategories).map((str: string) =>
        JSON.parse(str)
      ),
      category: JSON.parse(category),
    };

    const result = await this.#ProductService.updateProduct(
      productId,
      productDataStructure,
      productImageFile
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product Updated Successfully!',
      data: result,
    });
  });

  // delete product controller
  readonly deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.id;
    const result = await this.#ProductService.deleteProduct(productId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product Removed Successfully!',
      data: result,
    });
  });

  // get products by category controller
  readonly getProductsByCategory = catchAsync(
    async (req: Request, res: Response) => {
      const categoryId = req.params.categoryId;
      const paginationOptions = pick(req.query, paginationOptionFields);

      const result = await this.#ProductService.getProductsByCategory(
        paginationOptions,
        categoryId
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Get Products By Category Successfully!',
        data: result,
      });
    }
  );

  // get products by sub category controller
  readonly getProductsBySubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const subCategoryId = req.params.subCategoryId;
      const paginationOptions = pick(req.query, paginationOptionFields);

      const result = await this.#ProductService.getProductsBySubCategory(
        paginationOptions,
        subCategoryId
      );

      responseReturn(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Get Products By Sub Category Successfully!',
        data: result,
      });
    }
  );
}

export const ProductController = new ProductControllerClass(ProductService);
