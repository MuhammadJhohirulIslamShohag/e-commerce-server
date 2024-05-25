import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class ProductServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create product service
  readonly createProduct = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `products`,
      { ...req.body, files: req.files },
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all products service
  readonly allProducts = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(`products`, {
      params: req.query,
    });
    return response;
  };

  // get all products by filter service
  readonly getProductsByFilter = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(
      `products/by-filters`,
      {
        params: req.query,
      }
    );
    return response;
  };

  /* --------- get products by category service --------- */
  readonly getProductsByCategory = async (req: Request) => {
    const { categoryId } = req.params;

    const response: IGenericResponse = await CoreService.get(
      `products/categories/${categoryId}`,
      req.body
    );
    return response;
  };

  /* --------- get products by sub category service --------- */
  readonly getProductsBySubCategory = async (req: Request) => {
    const { subCategoryId } = req.params;

    const response: IGenericResponse = await CoreService.get(
      `products/sub-categories/${subCategoryId}`,
      req.body
    );
    return response;
  };

  // get single product service
  readonly getSingleProduct = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(`products/${id}`);
    return response;
  };

  // update product service
  readonly updateProduct = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `products/${id}`,
      { ...req.body, files: req.files },
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete product service
  readonly deleteProduct = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `products/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const ProductService = new ProductServiceClass();
