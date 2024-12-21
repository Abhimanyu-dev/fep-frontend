"use client";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import React, { Suspense, useEffect, useState } from "react";
import {
  Checkbox,
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
import studentLoginRequest, {
  LoginStudentParams,
} from "@/callbacks/auth/student/login";
import { useForm } from "react-hook-form";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginStudentParams>();

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const { setToken, setRole, setName, setUserID } = useStore();

  useEffect(() => {
    setToken("");
    setRole(0);
    setName("");
    setUserID("");
  }, [setToken, setName, setRole, setUserID]);

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const router = useRouter();
  const onLogin = async (data: LoginStudentParams) => {
    setLoading(true);
    const response = await studentLoginRequest.post(data);
    console.log(response);
    if (response.token !== "") {
      setToken(response.token);
      setRole(response.role_id);
      reset({
        email: "",
        password: "",
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        alignItems="center"
        spacing={10}
      >
        <div className="">
          <Image
            src="/images/logo.png"
            height={550}
            width={500}
            alt="iitklogo"
          />
        </div>
        <Stack
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: "70vh" }}
        >
          <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
            <h2 className="font-bold text-2xl">Welcome Back!</h2>
          </FormControl>
          <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
            <TextField
              id="Email ID"
              label="Email ID"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email ? "Incorrect Email ID" : ""}
              {...register("email", {
                required: true,
                pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                setValueAs: (value) => value.trim(),
              })}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
            <InputLabel htmlFor="password" error={!!errors.password}>
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
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
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
          <FormControl sx={{ m: 1, width: "37ch" }} variant="outlined">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" color="text.secondary">
                <Checkbox
                  size="small"
                  {...register("remember_me")}
                  inputProps={{ "aria-label": "controlled" }}
                />
                Remember Me
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                <span style={{ color: "red" }}>
                  <Link href="/auth/forgot-password">Forgot password?</Link>
                </span>
              </Typography>
            </Stack>
          </FormControl>
          <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={handleSubmit(onLogin)}
            >
              Sign In
            </LoadingButton>
          </FormControl>
          <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
            <Typography>
              Don&apos;t have an account?{" "}
              <span style={{ color: "red" }}>
                <Link href="/auth/signup">Sign Up</Link>
              </span>
            </Typography>
          </FormControl>
        </Stack>
      </Stack>
    </div>
  );
}

Login.layout = "Navigation";
export default Login;
