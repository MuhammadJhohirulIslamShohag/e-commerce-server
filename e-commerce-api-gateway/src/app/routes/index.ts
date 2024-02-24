import express from 'express';

const router = express.Router();

const moduleRoutes = [
  {
    path: '',
    route: express.Router(),
  },
];

moduleRoutes.forEach(mr => {
  router.use(mr.path, mr.route);
});

export default router;
