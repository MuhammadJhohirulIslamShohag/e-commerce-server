import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

import { ColorValidation } from './color.validation';
import { ColorController } from './color.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

class ColorRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // create and get all colors routes
    this.routers
      .route('/')
      .post(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        validateRequest(ColorValidation.colorCreateZodSchema),
        ColorController.createColor
      )
      .get(ColorController.allColors);

    // update and get single color, delete routes
    this.routers
      .route('/:id')
      .patch(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        validateRequest(ColorValidation.colorUpdateZodSchema),
        ColorController.updateColor
      )
      .get(ColorController.getSingleColor)
      .delete(
        auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
        ColorController.deleteColor
      );
  }
}

const allRoutes = new ColorRouterClass().routers;

export { allRoutes as ColorRoutes };
