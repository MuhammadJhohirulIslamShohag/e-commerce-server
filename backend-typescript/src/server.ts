/* eslint-disable no-console */
import { Server } from 'http';
import app from './app';
import config from './config';
import { database_connection } from './db/mongo.db';

// handle uncaught exception error if any developer take mistake, work it synchronous
process.on('uncaughtException', error => {
  console.log(error);
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
      console.log(
        `Aladdin-E-Commerce Application is Running on ${config.port}`
      );
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  // though which we can handle async and synchronous api error
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

startServer();

process.on('SIGTERM', () => {
  console.log('Signal termination is received');
  if (server) {
    server.close();
  }
});
