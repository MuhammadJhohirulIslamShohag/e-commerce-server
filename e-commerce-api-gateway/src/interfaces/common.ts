/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericErrorMessage } from './error';

export type IGenericResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    total: number;
    limit: number;
  };
  data?: any;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};
