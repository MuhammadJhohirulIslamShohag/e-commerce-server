import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class ReviewServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create review service
  readonly createReview = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `reviews`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all reviews service
  readonly allReviews = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(
      `reviews`,
      {
        params: req.query,
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get single review service
  readonly getSingleReview = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(
      `reviews/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // update review service
  readonly updateReview = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `reviews/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete review service
  readonly deleteReview = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `reviews/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const ReviewService = new ReviewServiceClass();
