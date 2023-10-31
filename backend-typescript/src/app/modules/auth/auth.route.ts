import express from 'express';
import { AuthUserController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthUserValidation } from './auth.validation';
import { auth } from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-or-update-user',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(AuthUserValidation.createOrUpdateUserZodSchema),
  AuthUserController.createOrUpdateUser
);

router.get(
  '/current-user',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  AuthUserController.currentUser
);

export const AuthRoutes = router;
