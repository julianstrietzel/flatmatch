import {
  createFlatProfileApi,
  getFlatProfileApi,
  uploadFlatProfileImagesApi,
} from "../api/profilesApi.ts";
import { IFlatProfile } from "../types/Profile.ts";
import { FlatProfile } from "../types/FlatProfile.ts";
import { handleApiError } from "../api/apiClient.ts";

export const getFlatProfile = async (
  flatProfileId: string
): Promise<IFlatProfile> => {
  try {
    const response = await getFlatProfileApi(flatProfileId);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const createFlatProfile = async (
  data: FlatProfile
): Promise<FlatProfile> => {
  try {
    const response = await createFlatProfileApi(data);

    if (response.status !== 201) {
      throw new Error("Failed to save form data: ");
    }

    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const uploadFlatProfileImages = async (
  data: FormData
): Promise<{ images: string[] }> => {
  try {
    const response = await uploadFlatProfileImagesApi(data);
    return response.data;
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export interface CarouselItem {
  id: string;
  name: string;
  imageUrl: string;
  approvedSearchProfiles: string[];
  disapprovedSearchProfiles: string[];
}
// Fetch a carousel item by its flat profile ID
export const fetchCarouselItem = async (
  flatProfileId: string
): Promise<CarouselItem> => {
  try {
    const response = await getFlatProfileApi(flatProfileId);
    const { street, buildingNumber } = response.data.address;
    const images = response.data.images;
    const approved = response.data.approved;
    const disapproved = response.data.disapproved;
    return {
      id: response.data._id,
      name: `${street} ${buildingNumber}`,
      imageUrl: images.length ? images[0] : "https://via.placeholder.com/100",
      approvedSearchProfiles: approved,
      disapprovedSearchProfiles: disapproved,
    };
  } catch (error: unknown) {
    console.error("Error fetching carousel item:", error);
    return {
      id: flatProfileId,
      name: "Unknown Address",
      imageUrl: "https://via.placeholder.com/100",
      approvedSearchProfiles: [],
      disapprovedSearchProfiles: [],
    };
  }
};
