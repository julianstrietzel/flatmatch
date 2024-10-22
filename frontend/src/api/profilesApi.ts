import apiClient from "./apiClient.ts";
import { FlatProfile } from "../types/FlatProfile.ts";
import { AxiosResponse } from "axios";

export const getFlatProfileApi = (flatProfileId: string) =>
  apiClient.get(`/v1/flat-profiles/${flatProfileId}`);

export const createFlatProfileApi = async (
  data: FlatProfile
): Promise<AxiosResponse<FlatProfile>> =>
  await apiClient.post("/v1/flat-profiles/", data);

export const uploadFlatProfileImagesApi = async (
  data: FormData
): Promise<AxiosResponse<{ images: string[] }>> =>
  await apiClient.post("/v1/flat-profiles/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getSearchProfileApi = (searchProfileId: string) =>
  apiClient.get(`/v1/search-profiles/${searchProfileId}`);
