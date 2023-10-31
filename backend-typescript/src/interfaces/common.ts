import { IGenericErrorMessage } from './error';

export type IGenericResponse<T> = {
  meta: {
    page: number;
    count: number;
    limit: number;
  };
  data: T | null;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type ILoginUserResponse = {
  refreshToken?: string;
  accessToken: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IUserPayload = {
  userId: string;
  role: string
};

