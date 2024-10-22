import { IAd } from "../types/Ad.ts";
import { fetchAdApi } from "../api/adApi.ts";
import { handleApiError } from "../api/apiClient.ts";

export const fetchAd = async (adId: string): Promise<IAd> => {
  try {
    const response = await fetchAdApi(adId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
