import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import AllRouters from './app/routes';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// middleware's
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// all of routers
app.use('/api/v1', AllRouters);

// root router or health router
app.get('/', (_req: Request, res: Response) => {
  res.json('E-Commerce Server is running');
});

// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;
