import axios, { AxiosResponse } from "axios";
import {
  STUDENT_AUTH_URL,
  ErrorType,
  SERVER_ERROR,
  StatusResponse,
} from "../../constants";
import { errorNotification, pushNotification } from "../../notification";

export interface OTPParams {
  email: string;
}
const authInstance = axios.create({
  baseURL: STUDENT_AUTH_URL,
  timeout: 15000,
  withCredentials: true,
  timeoutErrorMessage: SERVER_ERROR,
});

const otpRequest = {
  post: (body: OTPParams) =>
    authInstance
      .post<
        StatusResponse,
        AxiosResponse<StatusResponse, OTPParams>,
        OTPParams>("/api/auth/otp", body)
      .then((res) => {
        pushNotification("OTP Sent!", res.data.status);
        return true;
      })
      .catch((err: ErrorType) => {
        errorNotification("OTP request failed", err.response?.data?.error)
        return false;
      }),
};

export default otpRequest;