import { Router } from 'express';

import validateRequest from '../../../middlewares/validateRequest';
import { CommentController } from './comment.controller';
import { CommentValidation } from './comment.validation';

class CommentRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all comments routes
    this.routers
      .route('/')
      .post(
        validateRequest(CommentValidation.commentCreateZodSchema),
        CommentController.createComment
      )
      .get(CommentController.allComments);

    // update and get single comment, delete routes
    this.routers
      .route('/:id')
      .patch(
        validateRequest(CommentValidation.commentUpdateZodSchema),
        CommentController.updateComment
      )
      .get(CommentController.getSingleComment)
      .delete(CommentController.deleteComment);
  }
}

const allRoutes = new CommentRouterClass().routers;

export { allRoutes as CommentRoutes };
