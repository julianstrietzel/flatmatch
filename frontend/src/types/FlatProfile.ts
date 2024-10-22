import { Address } from "./Address.ts";

export interface FlatProfile {
  _id: string;
  account: string;
  name: string;
  description: string;
  tags: {
    tagKey: string;
  }[];
  requirements: {
    reqKey: string;
    weight: number;
  }[];
  address: Address;
  price: number;
  additionalCosts: number;
  totalCosts: number;
  size: number;
  type: string;
  images: string[];
  numberOfRooms: number;
}
