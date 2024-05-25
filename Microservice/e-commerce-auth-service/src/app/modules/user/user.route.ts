import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

import { UserValidation } from './user.validation';
import { UserController } from './user.controller';
import { ENUM_USER_ROLE } from '../../../enum/user';

class UserRoutesClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // add wish list
    this.routers.post(
      '/wishlist',
      auth(ENUM_USER_ROLE.USER),
      validateRequest(UserValidation.addWishListProductZodSchema),
      UserController.addWishListProduct
    );

    // delete wish list
    this.routers.route('/wishlist/:wishlistId').delete(
      auth(ENUM_USER_ROLE.USER),
      UserController.deleteProductFromWishlist
    );

    // all user
    this.routers.get('/', UserController.allUsers);

    // update, delete, get single user
    this.routers
      .route('/:id')
      .patch(
        validateRequest(UserValidation.updateUserZodSchema),
        auth(
          ENUM_USER_ROLE.ADMIN,
          ENUM_USER_ROLE.USER
        ),
        UserController.updateUser
      )
      .delete(
        auth(
          ENUM_USER_ROLE.ADMIN,
          ENUM_USER_ROLE.USER
        ),
        UserController.deleteUser
      )
      .get(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
        UserController.getSingleUser
      );
  }
}

const allRoutes = new UserRoutesClass().routers;

export { allRoutes as UserRoutes };
