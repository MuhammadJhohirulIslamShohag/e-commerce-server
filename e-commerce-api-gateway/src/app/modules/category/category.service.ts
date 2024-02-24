import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class CategoryServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create category service
  readonly createCategory = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `categories`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all categories service
  readonly allCategories = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(`categories`, {
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // get single category service
  readonly getSingleCategory = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(
      `categories/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // update category service
  readonly updateCategory = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `categories/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete category service
  readonly deleteCategory = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `categories/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const CategoryService = new CategoryServiceClass();
