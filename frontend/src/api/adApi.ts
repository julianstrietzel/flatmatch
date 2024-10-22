import apiClient from "./apiClient.ts";
import { IAd } from "../types/Ad.ts";
import { AxiosResponse } from "axios";

export const fetchAdApi = async (adId: string): Promise<AxiosResponse<IAd>> =>
  await apiClient.get(`/v1/ads/${adId}`);
