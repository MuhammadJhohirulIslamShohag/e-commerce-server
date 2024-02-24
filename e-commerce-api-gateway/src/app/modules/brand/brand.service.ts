import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class BrandServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create brand service
  readonly createBrand = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `brands`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all brands service
  readonly allBrands = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(
      `brands`,
      {
        params: req.query,
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get single brand service
  readonly getSingleBrand = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(
      `brands/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // update brand service
  readonly updateBrand = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `brands/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete brand service
  readonly deleteBrand = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `brands/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const BrandService = new BrandServiceClass();
