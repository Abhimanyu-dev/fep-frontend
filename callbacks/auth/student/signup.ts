import axios, { AxiosResponse } from "axios";
import {
  STUDENT_AUTH_URL,
  ErrorType,
  SERVER_ERROR,
  StatusResponse,
} from "../../constants";
export interface SignUpStudentParams {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  role_id: number;
  otp: number;
}
const authInstance = axios.create({
  baseURL: STUDENT_AUTH_URL,
  timeout: 15000,
  withCredentials: true,
  timeoutErrorMessage: SERVER_ERROR,
});
const studentSignUpRequest = {
  post: (body: SignUpStudentParams) =>
    authInstance
      .post<
        StatusResponse,
        AxiosResponse<StatusResponse, SignUpStudentParams>,
        SignUpStudentParams
      >("/api/auth/user/create", body)
      .then((res) => {
        return res;
      })
      .catch((err: ErrorType) => {
        return err;
      }),
};
export default studentSignUpRequest;
