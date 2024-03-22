import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

import catchAsync from '../../../shared/catchAsync';
import responseReturn from '../../../shared/responseReturn';

import { IComment } from './comment.interface';
import { CommentService } from './comment.service';

class CommentControllerClass {
  #CommentService: typeof CommentService;

  constructor(service: typeof CommentService) {
    this.#CommentService = service;
  }

  // create comment controller
  readonly createComment = catchAsync(async (req: Request, res: Response) => {
    const { ...commentData } = req.body;

    const result = await this.#CommentService.createComment(
      commentData,
      (req.user as JwtPayload).userId as string
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Comment Created Successfully!',
      data: result,
    });
  });

  // get all comments controller
  readonly allComments = catchAsync(async (req: Request, res: Response) => {
    const result = await this.#CommentService.allComments(req.query);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Comments Retrieved Successfully!',
      data: result.result,
      meta: result.meta,
    });
  });

  // get single comment user controller
  getSingleComment = catchAsync(async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const result = await CommentService.getSingleComment(commentId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Comment Retrieved Successfully!',
      data: result,
    });
  });

  // update comment controller
  readonly updateComment = catchAsync(async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const { ...updateCommentData } = req.body as Partial<IComment>;

    const result = await CommentService.updateComment(
      commentId,
      updateCommentData
    );

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Comment Updated Successfully!',
      data: result,
    });
  });

  // delete comment controller
  readonly deleteComment = catchAsync(async (req: Request, res: Response) => {
    const commentId = req.params.id;
    const result = await CommentService.deleteComment(commentId);

    responseReturn(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Comment Removed Successfully!',
      data: result,
    });
  });
}

export const CommentController = new CommentControllerClass(CommentService);
