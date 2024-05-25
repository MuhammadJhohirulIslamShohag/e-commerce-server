/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { JwtPayload } from 'jsonwebtoken';

export type IFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null;
      files: IFile;
    }
  }
}

type ModelType = Model<
  Document & {
    _id: import('mongoose').Types.ObjectId;
  }
>;
