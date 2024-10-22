import { IAccount, IDocument } from "../types/Account.ts";
import apiClient from "./apiClient.ts";
import { AxiosResponse } from "axios";

export const fetchAccountApi = async (
  data: string
): Promise<AxiosResponse<IAccount>> =>
  await apiClient.get(`/v1/accounts/${data}`);

export const updateAccountApi = async (
  data: Partial<IAccount>
): Promise<AxiosResponse<IAccount>> =>
  await apiClient.patch(`/v1/accounts/${data.id}`, data);

export const deleteAccountApi = async (
  accountId: string
): Promise<AxiosResponse<{ message: string }>> =>
  await apiClient.delete(`/v1/accounts/${accountId}`);

export const updateProfilePictureApi = async (
  accountId: string,
  data: File
): Promise<AxiosResponse<{ imageUrl: string }>> =>
  await apiClient.post(
    `/v1/accounts/${accountId}/profilePicture`,
    { profilePicture: data },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const updateDocumentsApi = async (
  accountId: string,
  documentType: string,
  data: File
): Promise<AxiosResponse<IDocument[]>> =>
  await apiClient.post(
    `/v1/accounts/${accountId}/documents`,
    { documentType: documentType, document: data },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const deleteProfilePictureApi = async (
  accountId: string
): Promise<AxiosResponse<{ message: string }>> =>
  await apiClient.delete(`/v1/accounts/${accountId}/profilePicture`);

export const deleteDocumentsApi = async (
  accountId: string,
  documentId: string
): Promise<AxiosResponse<IDocument[]>> =>
  await apiClient.delete(`/v1/accounts/${accountId}/documents/${documentId}`);

export const fetchLimitedAccountApi = (accountId: string) =>
  apiClient.get(`/v1/accounts/${accountId}/limited`);
