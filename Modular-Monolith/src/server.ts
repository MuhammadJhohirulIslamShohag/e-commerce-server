import { Server } from 'http';

import app from './app';
import config from './app/config';

import { errorLogger, logger } from './app/shared/logger';
import { database_connection } from './app/db/mongo.db';

// handle uncaught exception error if any developer take mistake, work it synchronous
process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

// assign server into server variable
let server: Server;

const startServer = async () => {
  try {
    // database connection
    await database_connection(config.mongo_url as string);

    // server listening
    server = app.listen(config.port, () => {
      logger.info(`E-Commerce Server is Running on ${config.port}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      errorLogger.error(error.message);
    }
  }

  // though which we can handle async and synchronous api error
  process.on('unhandledRejection', error => {
    // check server is running, if running close it server smoothly
    // otherwise server stop immediately
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

startServer();
