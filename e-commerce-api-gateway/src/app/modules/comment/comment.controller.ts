import { Request, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { CommentService } from './comment.service';

class CommentControllerClass {
  #CommentService: typeof CommentService;

  constructor(service: typeof CommentService) {
    this.#CommentService = service;
  }

  // create comment controller
  readonly createComment = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#CommentService.createComment(
        req
      );

      responseReturn(res, result);
    }
  );

  // get all comments controller
  readonly allComments = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#CommentService.allComments(
        req
      );

      responseReturn(res, result);
    }
  );

  // get single comment user controller
  readonly getSingleComment = catchAsync(
    async (req: Request, res: Response) => {
      const result =
        await this.#CommentService.getSingleComment(req);

      responseReturn(res, result);
    }
  );

  // update comment controller
  readonly updateComment = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#CommentService.updateComment(
        req
      );

      responseReturn(res, result);
    }
  );

  // delete comment controller
  readonly deleteComment = catchAsync(
    async (req: Request, res: Response) => {
      const result = await this.#CommentService.deleteComment(
        req
      );

      responseReturn(res, result);
    }
  );
}

export const CommentController = new CommentControllerClass(
  CommentService
);
