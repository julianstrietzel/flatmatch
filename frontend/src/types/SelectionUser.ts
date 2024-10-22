export interface SelectionUser {
  id: string;
  name: string;
  profileImage: string;
  images: string[];
  tags: string[];
  about: string;
  possibleFlats: string[];
  matchedFlats: string[];
  emailConfirmed: boolean;
  searchProfileId: string;
}

export interface TenantProfile {
  score: number;
  id: string;
}

export interface ProfileData {
  account: string;
  description: string;
  images: string[];
  tags: { tagKey: string }[];
  _id: string;
}

export interface AccountData {
  id: string;
  firstName: string;
  profilePicture?: string;
  emailConfirmed: boolean;
}
