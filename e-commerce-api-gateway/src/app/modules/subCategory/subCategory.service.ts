import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class SubCategoryServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create sub category service
  readonly createSubCategory = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `sub-categories`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all sub category service
  readonly allSubCategories = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(`sub-categories`, {
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // get single sub category service
  readonly getSingleSubCategory = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(
      `sub-categories/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // update sub category service
  readonly updateSubCategory = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `sub-categories/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete sub category service
  readonly deleteSubCategory = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `sub-categories/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const SubCategoryService = new SubCategoryServiceClass();
