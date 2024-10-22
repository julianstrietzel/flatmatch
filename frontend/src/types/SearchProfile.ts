export interface SearchProfile {
  _id: string;
  account: string;
  name: string;
  description: string;
  numberOfRooms: number;
  size: number;
  type: string;
  tags: {
    tagKey: string;
  }[];
  requirements: {
    reqKey: string;
    weight: number;
  }[];
  images: string[];
  priceRange: {
    min: number;
    max: number;
  };
  city: string;
  country: string;
}
