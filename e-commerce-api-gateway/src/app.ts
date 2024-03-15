import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path'
import cookieParser from 'cookie-parser';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import AllRouters from './app/routes';

// const swaggerDoc = YAML.load("../swagger.yaml")
const swaggerDoc = YAML.load(path.resolve("swagger.yaml"))
const app: Application = express();

// middleware's
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// all of routers
app.use('/api/v1', AllRouters);

// root router or health router
app.get('/', (_req: Request, res: Response) => {
  res.json('Api Gateway For E-Commerce Application is Running');
});

// global error handler
app.use(globalErrorHandler);

// not found route
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    statusCode: httpStatus.NOT_FOUND,
    message: 'Not Found Route!',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Not Found Route!',
      },
    ],
  });
});

export default app;
