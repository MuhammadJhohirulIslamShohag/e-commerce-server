import { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../shared/catchAsync';
import responseReturn from '../../shared/responseReturn';

import { productFilterableFields } from './product.constant';
import { ProductService } from './product.service';
import { pick } from '../../shared/pick';
import { paginationOptionFields } from '../../constants/pagination';

class ProductControllerClass {
  #ProductService: typeof ProductService;

  constructor(service: typeof ProductService) {
    this.#ProductService = service;
  }

  // create product controller
  readonly createProduct = catchAsync(async (req: Request, res: Response) => {
    const { ...productData } = req.body;

    const result = await this.#ProductService.createProduct(productData);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product Created Successfully!',
      data: result,
    });
  });

  // get all product controller
  readonly allProducts = catchAsync(async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationOptionFields);
    const filters = pick(req.query, productFilterableFields);

    const result = await this.#ProductService.allProducts(
      paginationOptions,
      filters
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Products Retrieved Successfully!',
      data: result,
    });
  });

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
    const { ...updateProductData } = req.body;
    const result = await this.#ProductService.updateProduct(
      productId,
      updateProductData
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
