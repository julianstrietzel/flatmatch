import axios from "axios";
import { User } from "../types/User";
import {
  signupApi,
  loginApi,
  changePasswordApi,
  reAuthApi,
} from "../api/authApi";
import { SignUpData, LoginData, ChangePasswordData } from "../types/Auth";
import { handleApiError } from "../api/apiClient.ts";

export const signup = async (
  data: SignUpData
): Promise<{ token: string; user: User }> => {
  try {
    const response = await signupApi(data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 409) {
        throw new Error("Email already in use");
      }
      const errorData: { errors: { msg: string }[] } = error.response.data;
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const errorMessages = errorData.errors.map((err) => err.msg).join("\n");
        throw new Error(`Signup failed:\n${errorMessages}`);
      }
    }
    throw new Error("Signup failed");
  }
};

export const login = async (
  data: LoginData
): Promise<{ token: string; user: User }> => {
  try {
    const response = await loginApi(data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData: { errors: { msg: string }[] } = error.response.data;
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const errorMessages = errorData.errors.map((err) => err.msg).join("\n");
        throw new Error(`Login failed:\n${errorMessages}`);
      }
    }
    throw new Error("Login failed. Please check your credentials");
  }
};

export const reAuth = async (): Promise<{ token: string; user: User }> => {
  try {
    const response = await reAuthApi();
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const changePassword = async (
  data: ChangePasswordData
): Promise<{ message: string }> => {
  try {
    const response = await changePasswordApi(data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      throw error.response.data.errors.map(
        (err: {
          type: string;
          value: string;
          msg: string;
          path: string;
          location: string;
        }) => err.msg
      );
    }
    throw new Error("Failed to change password");
  }
};
