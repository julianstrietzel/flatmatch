import { LandlordUser, TenantUser } from "./User.ts";

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: "tenant" | "landlord";
}

export interface AuthResponse {
  token: string;
  user: TenantUser | LandlordUser;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}
