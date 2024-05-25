import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';

import { ColorValidation } from './color.validation';
import { ColorController } from './color.controller';

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
        validateRequest(ColorValidation.colorCreateZodSchema),
        ColorController.createColor
      )
      .get(ColorController.allColors);

    // update and get single color, delete routes
    this.routers
      .route('/:id')
      .patch(
        validateRequest(ColorValidation.colorUpdateZodSchema),
        ColorController.updateColor
      )
      .get(ColorController.getSingleColor)
      .delete(ColorController.deleteColor);
  }
}

const allRoutes = new ColorRouterClass().routers;

export { allRoutes as ColorRoutes };
