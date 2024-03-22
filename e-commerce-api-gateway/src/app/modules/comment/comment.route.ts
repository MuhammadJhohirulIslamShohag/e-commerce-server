import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { CommentController } from './comment.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';
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
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(CommentValidation.commentCreateZodSchema),
        CommentController.createComment
      )
      .get(CommentController.allComments);

    // update and get single comment, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN),
        validateRequest(CommentValidation.commentUpdateZodSchema),
        CommentController.updateComment
      )
      .get(CommentController.getSingleComment)
      .delete(auth(ENUM_USER_ROLE.ADMIN), CommentController.deleteComment);
  }
}

const allRoutes = new CommentRouterClass().routers;

export { allRoutes as CommentRoutes };
