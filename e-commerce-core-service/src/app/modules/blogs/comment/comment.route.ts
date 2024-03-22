import { Router } from 'express';
import { CommentController } from './comment.controller';
import { CommentValidation } from './comment.validation';
import validateRequest from '../../../middlewares/validateRequest';

class BrandRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all Comments routes
    this.routers
      .route('/')
      .post(
        validateRequest(CommentValidation.commentCreateZodSchema),
        CommentController.createComment
      )
      .get(CommentController.allComments);

    // update and get single Comment, delete routes
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

const allRoutes = new BrandRouterClass().routers;

export { allRoutes as CommentRoutes };
