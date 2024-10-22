import mongoose, { Schema } from "mongoose";

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

export const addressSchema: Schema = new Schema<IAddress>({
  street: { type: String, required: true },
  buildingNumber: { type: Number, required: true, min: 1 },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
});

export const addressModel = mongoose.model<IAddress>("Address", addressSchema);
