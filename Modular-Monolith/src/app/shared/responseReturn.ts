import { Response } from 'express';

type IMeta = {
  page: number;
  limit: number;
  next: number | null,
  prev: number | null,
  totalPage: number,
  totalItems: number,
};

type ResponseReturnType<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: IMeta;
  data?: T | null;
};

const responseReturn = <T>(res: Response, data: ResponseReturnType<T>) => {
  const responseData: ResponseReturnType<T> = {
    statusCode: data.statusCode,
    success: data?.success,
    message: data?.message,
    meta: data?.meta,
    data: data?.data,
  };
  return res.status(responseData.statusCode).json(responseData);
};

export default responseReturn;
