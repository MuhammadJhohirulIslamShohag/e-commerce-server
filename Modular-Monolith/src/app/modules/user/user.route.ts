import { Router } from 'express';
import multer from 'multer';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

import { ENUM_USER_ROLE } from '../../enum/user';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 31457280 } });

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
      auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
      validateRequest(UserValidation.addWishListProductZodSchema),
      UserController.addWishListProduct
    );

    // delete wish list
    this.routers
      .route('/wishlist/:wishlistId')
      .delete(
        auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        UserController.deleteProductFromWishlist
      );

    // profile image upload
    this.routers.patch(
      '/upload-profile-image',
      auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
      upload.single('profileImage'),
      UserController.uploadProfileImage
    );

    // all user
    this.routers.get(
      '/',
      auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
      UserController.allUsers
    );

    // update, delete, get single user
    this.routers
      .route('/:id')
      .patch(
        validateRequest(UserValidation.updateUserZodSchema),
        auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        UserController.updateUser
      )
      .delete(
        auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        UserController.deleteUser
      )
      .get(
        auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        UserController.getSingleUser
      );
  }
}

const allRoutes = new UserRoutesClass().routers;

export { allRoutes as UserRoutes };
