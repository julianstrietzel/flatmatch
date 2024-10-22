export interface Address {
  street: string;
  buildingNumber: number;
  city: string;
  postalCode: string;
  country: string;
  state: string;
  latitude?: number;
  longitude?: number;
}
