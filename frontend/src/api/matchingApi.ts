import apiClient from "./apiClient.ts";
import { IChat } from "../types/Chat.ts";
import { AxiosResponse } from "axios";

export const getPromisingFlatsApi = async (
  searchProfileId: string,
  limit: number = 100,
  page: number = 0
) =>
  await apiClient.get(
    `/v1/matches/promising/flatProfiles/${searchProfileId}?limit=${limit}&page=${page}`
  );

export const likeFlatApi = async (
  searchProfileId: string,
  flatProfileId: string
): Promise<AxiosResponse<{ message: string }>> =>
  await apiClient.put(
    `/v1/matches/tenants/${searchProfileId}/likes/${flatProfileId}`
  );

export const dislikeFlatAPi = async (
  searchProfileId: string,
  flatProfileId: string
): Promise<AxiosResponse<{ message: string }>> =>
  await apiClient.put(
    `/v1/matches/tenants/${searchProfileId}/dislikes/${flatProfileId}`
  );

export const getMatchesByUserApi = async (
  userType: string
): Promise<AxiosResponse<IChat[]>> =>
  await apiClient.get(`/v1/chats/${userType}`);

export const getPromisingTenantsApi = (flatProfileId: string) =>
  apiClient.get(`/v1/matches/promising/searchProfiles/${flatProfileId}`);

export const approveTenantApi = async (
  flatProfileId: string,
  searchProfileId: string
): Promise<AxiosResponse<{ message: string }>> =>
  await apiClient.put(
    `/v1/matches/landlords/${flatProfileId}/approvals/${searchProfileId}`
  );

export const disapproveTenantApi = async (
  flatProfileId: string,
  searchProfileId: string
): Promise<AxiosResponse<{ message: string }>> =>
  await apiClient.put(
    `/v1/matches/landlords/${flatProfileId}/disapprovals/${searchProfileId}`
  );
