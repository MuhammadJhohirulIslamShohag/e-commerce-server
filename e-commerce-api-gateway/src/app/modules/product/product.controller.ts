import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { ProductService } from './product.service';

class ProductControllerClass {
  #ProductService: typeof ProductService;

  constructor(service: typeof ProductService) {
    this.#ProductService = service;
  }

  // create product controller
  readonly createProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#ProductService.createProduct(req);

    responseReturn(res, result);
  });

  // get all products controller
  readonly allProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#ProductService.allProducts(req);

    responseReturn(res, result);
  });

  // get products by category controller
  readonly getProductsByCategory = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ProductService.getProductsByCategory(req);

      responseReturn(res, result);
    }
  );

  // get products by sub category controller
  readonly getProductsBySubCategory = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ProductService.getProductsBySubCategory(req);

      responseReturn(res, result);
    }
  );

  // get single product user controller
  readonly getSingleProduct = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#ProductService.getSingleProduct(req);

      responseReturn(res, result);
    }
  );

  // update product controller
  readonly updateProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#ProductService.updateProduct(req);

    responseReturn(res, result);
  });

  // delete product controller
  readonly deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#ProductService.deleteProduct(req);

    responseReturn(res, result);
  });
}

export const ProductController = new ProductControllerClass(ProductService);
