import axios, { AxiosResponse } from "axios";
import {
  STUDENT_AUTH_URL,
  ErrorType,
  SERVER_ERROR,
  StatusResponse,responseBody
} from "../../constants";
import { errorNotification } from "@/callbacks/notification";
export interface LoginStudentParams {
  email: string;
  password:string;
  remember_me:boolean;
}
export interface LoginResponse {
  token: string;
  role_id: number;
}
const authInstance = axios.create({
  baseURL: STUDENT_AUTH_URL,
  timeout: 15000,
  withCredentials:true,
  timeoutErrorMessage: SERVER_ERROR,
});
const studentLoginRequest = {
  post: (body: LoginStudentParams) =>
  authInstance
    .post<
      LoginResponse,
      AxiosResponse<LoginResponse, LoginStudentParams>,
      LoginStudentParams
    >("/api/auth/user/login", body)
    .then(responseBody)
    .catch((err: ErrorType) => {
      console.log("Login Failed")
      errorNotification("Login Failed", err.response?.data?.error)
      return { user_id: "", token: "", role_id: 0 } as LoginResponse;
    }),
};
export default studentLoginRequest;