import express from 'express';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import { auth } from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

router
  .route('/my-profile')
  .get(
    auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
    UserController.getUserProfile
  )
  .patch(
    auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
    validateRequest(UserValidation.updateUserZodSchema),
    UserController.updateUserProfile
  );

router
  .route('/:id')
  .get(auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser)
  .patch(
    auth(ENUM_USER_ROLE.ADMIN),
    validateRequest(UserValidation.updateUserZodSchema),
    UserController.updateUser
  )
  .delete(auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
