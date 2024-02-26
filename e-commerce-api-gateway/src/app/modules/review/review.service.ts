import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class SizeServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create size service
  readonly createSize = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `sizes`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all sizes service
  readonly allSizes = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(
      `sizes`,
      {
        params: req.query,
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get single size service
  readonly getSingleSize = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(
      `sizes/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // update size service
  readonly updateSize = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `sizes/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete size service
  readonly deleteSize = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `sizes/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const SizeService = new SizeServiceClass();
