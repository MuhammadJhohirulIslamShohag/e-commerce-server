import mongoose from 'mongoose';
// import { logger, errorLogger } from '../shared/logger';

export const database_connection = async (uri: string) => {
  try {
    if (!uri) {
      // errorLogger.error('mongo uri is not find!');
      console.log('mongo uri is not find!');
    }
    await mongoose.connect(uri);
    // logger.info('mongodb database is running!');
    console.log('mongodb database is running!');
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      // errorLogger.error(error.message);
    }
  }
};
