export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: "tenant" | "landlord";
  profilePicture: string;
  premiumUser: boolean;
  premiumEndDate?: Date;
  aboutMe?: string;
}

export interface TenantUser extends User {
  profile?: string;
}

export interface LandlordUser extends User {
  profiles?: string[];
}

export function isTenantUser(user: User | null): user is TenantUser {
  return (user as TenantUser).accountType === "tenant";
}

export function isLandlordUser(user: User | null): user is LandlordUser {
  return (user as LandlordUser).accountType === "landlord";
}
