import { AxiosError } from 'axios';

const handleAxiosError = (error: AxiosError) => {
  const statusCode = 400;

  return {
    statusCode,
    message: (error?.response?.data as { message: string })?.message,
    errorMessages: error?.response?.data
      ? (
          error?.response?.data as {
            errorMessages: { path: string; message: string }[];
          }
        )?.errorMessages
      : [],
  };
};

export default handleAxiosError;
