import { IChat, IMessage } from "../types/Chat.ts";
import {
  createChatApi,
  getChatPartnerApi,
  getChatsByUserIdApi,
  getUnreadMessageCountApi,
  markReadMessagesApi,
  patchArchiveChatApi,
  postArchiveChatApi,
  postMessageApi,
} from "../api/chatApi.ts";
import { handleApiError } from "../api/apiClient.ts";

export const createChat = async (
  flatProfileId: string,
  searchProfileId: string
): Promise<IChat> => {
  try {
    const response = await createChatApi(flatProfileId, searchProfileId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const postMessage = async (
  chatId: string,
  message: IMessage
): Promise<IChat> => {
  try {
    const response = await postMessageApi(chatId, message);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const markReadMessages = async (
  chatId: string,
  userType: "landlord" | "tenant"
): Promise<IChat> => {
  try {
    const response = await markReadMessagesApi(chatId, userType);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const getUnreadMessageCount = async (
  userType: string
): Promise<{ unreadCount: number }> => {
  try {
    const response = await getUnreadMessageCountApi(userType);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const getChatPartner = async (
  chatId: string,
  userType: "landlord" | "tenant"
): Promise<{ title: string; name: string; image: string }> => {
  try {
    const response = await getChatPartnerApi(chatId, userType);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const getChatsByUserId = async (userType: string): Promise<IChat[]> => {
  try {
    const response = await getChatsByUserIdApi(userType);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const patchArchiveChat = async (chatId: string): Promise<IChat> => {
  try {
    const response = await patchArchiveChatApi(chatId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const postArchiveChat = async (
  searchProfileId: string,
  flatProfileId: string
): Promise<{ message: string; data: IChat[] }> => {
  try {
    const response = await postArchiveChatApi(searchProfileId, flatProfileId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
