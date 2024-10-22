import {
  approveTenantApi,
  dislikeFlatAPi,
  disapproveTenantApi,
  getMatchesByUserApi,
  getPromisingFlatsApi,
  likeFlatApi,
} from "../api/matchingApi.ts";
import { IChat } from "../types/Chat.ts";
import { handleApiError } from "../api/apiClient.ts";

export const getPromisingFlats = async (
  searchProfileId: string,
  limit: number = 100,
  page: number = 0
): Promise<{
  data: { score: number; id: string; isAd: boolean }[];
  page: number;
}> => {
  try {
    const response = await getPromisingFlatsApi(searchProfileId, limit, page);
    if (response.status !== 200 && response.status !== 204) {
      throw new Error(
        `Error fetching flat profile ids. Status code: ${response.status}: ${response.data}`
      );
    }
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const likeFlat = async (
  searchProfileId: string,
  flatProfileId: string
): Promise<{ message: string }> => {
  try {
    const response = await likeFlatApi(searchProfileId, flatProfileId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const dislikeFlat = async (
  searchProfileId: string,
  flatProfileId: string
): Promise<{ message: string }> => {
  try {
    const response = await dislikeFlatAPi(searchProfileId, flatProfileId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const getMatchesByUser = async (userType: string): Promise<string[]> => {
  try {
    const response = await getMatchesByUserApi(userType);
    return response.data.map((chat: IChat) => chat.flatProfile);
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const approveTenant = async (
  flatProfileId: string,
  searchProfileId: string
): Promise<{ message: string }> => {
  try {
    const response = await approveTenantApi(flatProfileId, searchProfileId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const disapproveTenant = async (
  flatProfileId: string,
  searchProfileId: string
): Promise<{ message: string }> => {
  try {
    const response = await disapproveTenantApi(flatProfileId, searchProfileId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
