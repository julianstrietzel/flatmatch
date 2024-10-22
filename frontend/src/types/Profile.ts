export interface IAddress {
  street: string;
  buildingNumber: number;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface IFlatProfile {
  _id: string;
  name: string;
  description: string;
  tags: {
    tagKey: string;
  }[];
  images: string[];
  address: IAddress;
  price: number;
  size: number;
  type: string;
}
