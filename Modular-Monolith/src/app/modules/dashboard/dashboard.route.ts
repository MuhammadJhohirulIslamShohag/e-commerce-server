import { Router } from 'express';

import { dashboardController } from './dashboard.controller';
import { ENUM_USER_ROLE } from '../../enum/user';

import auth from '../../middlewares/auth';

class DashboardRouterClass {
  readonly routers: Router;
  constructor() {
    this.routers = Router();
    this.#RouterAction();
  }

  #RouterAction() {
    // dash-widget-info routes
    this.routers.get(
      '/dash-widget-info',
      auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
      dashboardController.dashWidgetInfo
    );
  }
}

const allRoutes = new DashboardRouterClass().routers;

export { allRoutes as DashboardRoutes };
