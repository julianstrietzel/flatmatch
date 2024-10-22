import { AxiosResponse } from "axios";
import {
  SignUpData,
  LoginData,
  ChangePasswordData,
  AuthResponse,
} from "../types/Auth";
import apiClient from "./apiClient.ts";

export const signupApi = async (
  data: SignUpData
): Promise<AxiosResponse<AuthResponse>> =>
  await apiClient.post(`/v1/auth/signup`, data);

export const loginApi = async (
  data: LoginData
): Promise<AxiosResponse<AuthResponse>> =>
  await apiClient.post(`/v1/auth/login`, data);

export const confirmEmailApi = (token: string) =>
  apiClient.get(`/v1/auth/confirm-email/${encodeURIComponent(token)}`);
export const changePasswordApi = async (
  data: ChangePasswordData
): Promise<AxiosResponse<{ message: string }>> =>
  await apiClient.post(`/v1/auth/changePassword`, data);

export const reAuthApi = async (): Promise<AxiosResponse<AuthResponse>> =>
  await apiClient.get(`/v1/auth/reAuth`);
