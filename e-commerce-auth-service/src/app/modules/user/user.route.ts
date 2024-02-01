import { Router } from 'express';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../../enum/user';
import auth from '../../middlewares/auth';

class UserRoutesClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // add shipping address
    this.routers.post(
      '/add-shipping-address',
      validateRequest(UserValidation.addShippingAddressZodSchema),
      auth(ENUM_USER_ROLE.USER),
      UserController.addShippingAddressToUser
    );

    // update shipping address
    this.routers.patch(
      '/update-shipping-address',
      validateRequest(UserValidation.updateShippingAddressZodSchema),
      auth(ENUM_USER_ROLE.USER),
      UserController.updateShippingAddressToUser
    );

    // update shipping address
    this.routers.delete(
      '/delete-shipping-address/:id',
      auth(ENUM_USER_ROLE.USER),
      UserController.deleteShippingAddressToUser
    );

    // add wish list
    this.routers.post(
      '/wishlist',
      auth(ENUM_USER_ROLE.USER),
      validateRequest(UserValidation.addWishListProductZodSchema),
      UserController.addWishListProduct
    );

    // delete wish list
    this.routers
      .route('/wishlist/:wishlistId')
      .delete(
        auth(ENUM_USER_ROLE.USER),
        UserController.deleteProductFromWishlist
      );

    // all user
    this.routers.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.allUsers);

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
