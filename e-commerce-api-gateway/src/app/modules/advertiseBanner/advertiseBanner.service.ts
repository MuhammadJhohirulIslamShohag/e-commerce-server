import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class AdvertiseBannerServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create advertise banner service
  readonly createAdvertiseBanner = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `advertise-banners`,
      {...req.body, files: req.files},
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all advertise banners service
  readonly allAdvertiseBanners = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(
      `advertise-banners`,
      {
        params: req.query,
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get single advertise banner service
  readonly getSingleAdvertiseBanner = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(
      `advertise-banners/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // update advertise banner service
  readonly updateAdvertiseBanner = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `advertise-banners/${id}`,
      {...req.body, files: req.files},
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete advertise banner service
  readonly deleteAdvertiseBanner = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `advertise-banners/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const AdvertiseBannerService = new AdvertiseBannerServiceClass();
