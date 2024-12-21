import { Visibility, VisibilityOff } from "@mui/icons-material";  
import LoadingButton from "@mui/lab/LoadingButton";
import {
  CircularProgress,
  Collapse,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import Link from "next/link";

import studentSignUpRequest, {
  SignUpStudentParams,
} from "@/callbacks/auth/student/signup";
import otpRequest, { OTPParams } from "@/callbacks/auth/student/otp";
import { useRouter } from "next/navigation";

function SignUpStudent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<SignUpStudentParams>();

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: errorsOTP },
  } = useForm<OTPParams>();

  const [emailStatus, setEmailStatus] = useState(false);
  const [values, setValues] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (data: SignUpStudentParams) => {
    data.role_id = 100;
    setLoading(true);
    const response = await studentSignUpRequest.post(data);
    if (response) {
      router.push("/auth/login");
    }
    setLoading(false);
  };

  const handleClickShowPassword = (pass: string) => {
    if (pass === "password") {
      setValues({
        ...values,
        showPassword: !values.showPassword,
      });
    } else {
      setValues({
        ...values,
        showConfirmPassword: !values.showConfirmPassword,
      });
    }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleEmailOtpSubmit = async (data: OTPParams) => {
    setValue("email", data.email);
    setLoading(true);
    const response = await otpRequest.post(data);
    console.log(response)
    setEmailStatus(response);
    setLoading(false);
  };

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const titleCase = (str: string) => {
    const escapedStr = str.replace(/\s\s+/g, " ");
    const splitStr = escapedStr
      .trim()
      .toLowerCase()
      .split(" ")
      .map(capitalizeFirstLetter);
    return splitStr.join(" ");
  };

  return (
    <div>
      <Stack justifyContent="center" alignItems="center" spacing={2}>
        <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            disabled={emailStatus}
            {...register("name", {
              required: true,
              setValueAs: (value) => titleCase(value),
            })}
            error={!!errors.name}
            helperText={errors.name ? "Name is required!" : ""}
          />
        </FormControl>

        <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
          <TextField
            id="email"
            label="IITK Email ID"
            variant="outlined"
            disabled={emailStatus}
            {...registerOTP("email", {
              required: true,
              pattern: /^[^@]+@iitk\.ac\.in$/,
              setValueAs: (value) => value.trim().toLowerCase(),
            })}
            error={!!errorsOTP.email}
            helperText={errorsOTP.email ? "Invalid IITK Email ID" : ""}
          />
        </FormControl>

        {!emailStatus && (
          <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={handleSubmitOTP(handleEmailOtpSubmit)}
            >
              Next
            </LoadingButton>
          </FormControl>
        )}

        <Collapse in={emailStatus}>
          <Suspense fallback={<CircularProgress />}>
            <Stack>
              <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
                <Typography variant="caption" sx={{ color: "#777" }}>
                  An OTP has been sent to your <b>&lt;cc_id&gt;@iitk.ac.in</b>
                </Typography>
                <TextField
                  id="OTP"
                  label="OTP"
                  variant="outlined"
                  {...register("otp", {
                    required: true,
                    setValueAs: (otp) => {
                      return parseInt(otp)
                    }
                  })}
                  disabled={!emailStatus}
                  error={!!errors.otp}
                  helperText={errors.otp ? "OTP is required!" : ""}
                ></TextField>
              </FormControl>
              <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  error={!!errors.password}
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password"
                  error={!!errors.password}
                  type={values.showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword("password")}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {errors.password && (
                  <FormHelperText error={!!errors.password}>
                    Incorrect password
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  error={!!errors.confirm_password}
                >
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  error={!!errors.confirm_password}
                  type={values.showConfirmPassword ? "text" : "password"}
                  {...register("confirm_password", {
                    required: true,
                    validate: {
                      sameAsPassword: (value) =>
                        value === getValues("password"),
                    },
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          handleClickShowPassword("confirmPassword")
                        }
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
                {errors.confirm_password && (
                  <FormHelperText error={!!errors.confirm_password}>
                    Passwords don't match
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  onClick={handleSubmit(handleSignUp)}
                >
                  Sign Up
                </LoadingButton>
              </FormControl>
            </Stack>
          </Suspense>
        </Collapse>
        <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
          <Typography>
            Already have an account?{" "}
            <span style={{ color: "red" }}>
              <Link href="/auth/login">Sign In</Link>
            </span>
          </Typography>
        </FormControl>
      </Stack>
    </div>
  );
}

export default SignUpStudent;
