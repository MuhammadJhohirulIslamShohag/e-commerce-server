import express, { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';

const router: Router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
];

moduleRoutes.forEach(mr => router.use(mr.path, mr.route));

export default router;
