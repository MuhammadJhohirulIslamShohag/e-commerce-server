import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path'
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerUiDist from 'swagger-ui-dist';
import YAML from 'yamljs';

import globalErrorHandler from './app/middlewares/globalErrorHandler';
import AllRouters from './app/routes';
import notFound from './app/middlewares/notFound';


//const swaggerDoc = YAML.load(path.resolve("swagger.yaml"))
const swaggerDoc = YAML.load(path.resolve(__dirname, 'swagger.yaml'));
const app: Application = express();
const ROOT_FOLDER = path.join(__dirname, "..");
const SRC_FOLDER = path.join(ROOT_FOLDER, "src");

// Serve static files from swagger-ui-dist
const swaggerUiAssetPath = swaggerUiDist.getAbsoluteFSPath();
app.use('/swagger-ui', express.static(swaggerUiAssetPath));

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
// app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const options = {
  customCssUrl: "/public/swagger-ui.css",
  customSiteTitle: "Aladin E-Commerce API - Swagger",
  persistAuthorization: true
};

app.use("/public", express.static(path.join(SRC_FOLDER, "public")));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));

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
