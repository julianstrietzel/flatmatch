import { IFlatProfile } from "./Profile.ts";

export interface IAd {
  title: string;
  description: string;
  tags: {
    tagKey: string;
  }[];
  image: string;
  url: string;
}

export function isAd(flatProfile: IFlatProfile | IAd): flatProfile is IAd {
  return (flatProfile as IAd).title !== undefined;
}
