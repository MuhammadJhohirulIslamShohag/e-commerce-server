import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class ColorServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create color service
  readonly createColor = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `colors`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all colors service
  readonly allColors = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(`colors`, {
      params: req.query,
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // get single color service
  readonly getSingleColor = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(`colors/${id}`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    return response;
  };

  // update color service
  readonly updateColor = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `colors/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete color service
  readonly deleteColor = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `colors/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const ColorService = new ColorServiceClass();
