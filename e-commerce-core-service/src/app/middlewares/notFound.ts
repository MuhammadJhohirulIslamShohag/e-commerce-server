import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    statusCode: httpStatus.NOT_FOUND,
    message: 'No Api Found!',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'No Api Found!',
      },
    ],
  });
  next();
};

export default notFound;
