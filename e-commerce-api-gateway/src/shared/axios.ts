import axios, { AxiosInstance } from 'axios';
import config from '../config';

const HttpServer = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // interceptors for request
  instance.interceptors.request.use(
    request => {
      return request;
    },
    error => {
      return error;
    }
  );

  // interceptors for response
  instance.interceptors.request.use(
    response => {
      return response.data;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return instance;
};

const AuthService = HttpServer(config.auth_service_url);
const CoreService = HttpServer(config.core_service_url);

export { HttpServer, AuthService, CoreService };
