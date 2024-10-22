import axios from "axios";
import { IAccount, IDocument } from "../types/Account.ts";
import {
  deleteAccountApi,
  deleteDocumentsApi,
  deleteProfilePictureApi,
  fetchAccountApi,
  updateAccountApi,
  updateDocumentsApi,
  updateProfilePictureApi,
} from "../api/accountApi.ts";
import { handleApiError } from "../api/apiClient.ts";

export const fetchAccount = async (accountId: string): Promise<IAccount> => {
  try {
    const response = await fetchAccountApi(accountId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const updateAccount = async (
  account: Partial<IAccount>
): Promise<IAccount> => {
  try {
    const response = await updateAccountApi(account);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      const messages = error.response.data.errors
        .map((err: { msg: string }) => err.msg)
        .join(", ");
      throw new Error(messages);
    }
    return handleApiError(error);
  }
};

export const deleteAccount = async (
  accountId: string
): Promise<{ message: string }> => {
  try {
    const response = await deleteAccountApi(accountId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const updateProfilePicture = async (
  accountId: string,
  data: File
): Promise<{ imageUrl: string }> => {
  try {
    const response = await updateProfilePictureApi(accountId, data);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const updateDocuments = async (
  accountId: string,
  documentType: string,
  data: File
): Promise<IDocument[]> => {
  try {
    const response = await updateDocumentsApi(accountId, documentType, data);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const deleteProfilePicture = async (
  accountId: string
): Promise<{ message: string }> => {
  try {
    const response = await deleteProfilePictureApi(accountId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const deleteDocuments = async (
  accountId: string,
  documentId: string
): Promise<IDocument[]> => {
  try {
    const response = await deleteDocumentsApi(accountId, documentId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
