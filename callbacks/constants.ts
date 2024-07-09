import { AxiosError, AxiosResponse } from "axios";
export const STUDENT_AUTH_URL = `http://localhost:8080`;
export const SERVER_ERROR = "Aw, Snap! Server maybe down.";
export interface ErrorResponse {
  error: string;
}
export interface StatusResponse {
  status: string;
}

export const setConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const responseBody = <T>(response: AxiosResponse<T>) => response.data;
export type ErrorType = AxiosError<ErrorResponse>;