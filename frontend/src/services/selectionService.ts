import { getPromisingTenantsApi } from "../api/matchingApi";
import { getSearchProfileApi } from "../api/profilesApi";
import { fetchLimitedAccountApi } from "../api/accountApi";
import {
  SelectionUser,
  TenantProfile,
  ProfileData,
  AccountData,
} from "../types/SelectionUser";
import defaultUser from "../assets/default_user.svg";

export const fetchUserProfiles = async (
  flatId: string,
  approvedProfiles: string[] = []
): Promise<SelectionUser[]> => {
  try {
    let tenantProfiles: TenantProfile[] = [];

    if (approvedProfiles.length > 0) {
      tenantProfiles = approvedProfiles.map((id) => ({ id }) as TenantProfile);
    } else {
      const tenantsResponse = await getPromisingTenantsApi(flatId);

      if (!tenantsResponse.data || !Array.isArray(tenantsResponse.data.data)) {
        return [];
      }

      tenantProfiles = tenantsResponse.data.data;
    }

    const userProfiles = await Promise.all(
      tenantProfiles.map(async (tenant: TenantProfile) => {
        const profileResponse = await getSearchProfileApi(tenant.id);
        const profileData: ProfileData = profileResponse.data[0];

        const accountResponse = await fetchLimitedAccountApi(
          profileData.account
        );
        const accountData: AccountData = accountResponse.data;

        // Include profileImage in images array if it exists
        const images = profileData.images || [];
        if (accountData.profilePicture) {
          images.unshift(accountData.profilePicture);
        }

        return {
          id: accountData.id,
          searchProfileId: profileData._id,
          name: accountData.firstName,
          profileImage: accountData.profilePicture || defaultUser,
          images: images,
          tags: profileData.tags.map((tag) => tag.tagKey),
          about: profileData.description || "",
          possibleFlats: [flatId],
          matchedFlats: [],
          emailConfirmed: accountData.emailConfirmed,
        } as SelectionUser;
      })
    );

    return userProfiles;
  } catch (error) {
    console.error("Error fetching user profiles:", error);
    return [];
  }
};
