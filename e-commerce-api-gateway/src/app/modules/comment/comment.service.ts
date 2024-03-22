import { Request } from 'express';
import { CoreService } from '../../../shared/axios';
import { IGenericResponse } from '../../../interfaces/common';

class CommentServiceClass {
  #CoreService;
  constructor() {
    this.#CoreService = CoreService;
  }

  // create comment service
  readonly createComment = async (req: Request) => {
    const response: IGenericResponse = await this.#CoreService.post(
      `comments`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get all comments service
  readonly allComments = async (req: Request) => {
    const response: IGenericResponse = await CoreService.get(
      `comments`,
      {
        params: req.query,
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // get single comment service
  readonly getSingleComment = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.get(
      `comments/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // update comment service
  readonly updateComment = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.patch(
      `comments/${id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };

  // delete comment service
  readonly deleteComment = async (req: Request) => {
    const { id } = req.params;

    const response: IGenericResponse = await CoreService.delete(
      `comments/${id}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    return response;
  };
}

export const CommentService = new CommentServiceClass();
