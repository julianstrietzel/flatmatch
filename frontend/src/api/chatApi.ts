import { IChat, IMessage } from "../types/Chat.ts";
import apiClient from "./apiClient.ts";
import { AxiosResponse } from "axios";

export const createChatApi = async (
  flatProfileId: string,
  searchProfileId: string
): Promise<AxiosResponse<IChat>> =>
  await apiClient.post("/v1/chats/", {
    flatProfile: flatProfileId,
    searchProfile: searchProfileId,
  });

export const postMessageApi = async (
  chatId: string,
  data: IMessage
): Promise<AxiosResponse<IChat>> => apiClient.post(`/v1/chats/${chatId}`, data);

export const markReadMessagesApi = async (
  chatId: string,
  userType: "landlord" | "tenant"
): Promise<AxiosResponse<IChat>> =>
  await apiClient.post(`/v1/chats/${chatId}/${userType}/read`);

export const getUnreadMessageCountApi = async (
  userType: string
): Promise<AxiosResponse<{ unreadCount: number }>> =>
  await apiClient.get(`/v1/chats/${userType}/unread`);

export const getChatPartnerApi = async (
  chatId: string,
  userType: "landlord" | "tenant"
): Promise<AxiosResponse<{ title: string; name: string; image: string }>> =>
  await apiClient.get(`/v1/chats/${chatId}/${userType}/partner`);

export const getChatsByUserIdApi = async (
  userType: string
): Promise<AxiosResponse<IChat[]>> =>
  await apiClient.get(`/v1/chats/${userType}`);

export const patchArchiveChatApi = async (
  chatId: string
): Promise<AxiosResponse<IChat>> =>
  await apiClient.patch(`/v1/chats/archive/${chatId}`);

export const postArchiveChatApi = async (
  searchProfileId: string,
  flatProfileId: string
): Promise<AxiosResponse<{ message: string; data: IChat[] }>> =>
  await apiClient.post(`/v1/chats/${searchProfileId}/${flatProfileId}/archive`);
