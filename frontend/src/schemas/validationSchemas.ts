import { z } from "zod";

export const FlatProfileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  address: z.object({
    street: z.string().min(1, { message: "Street is required" }),
    buildingNumber: z
      .number()
      .min(1, { message: "Building number is required" }),
    city: z.string().min(1, { message: "City is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    state: z.string().min(1, { message: "State is required" }),
  }),
  price: z.number().min(0),
  additionalCosts: z.number().min(0),
  totalCosts: z.number().min(0),
  size: z.number().min(0),
  type: z.string().min(1, { message: "Type is required" }),
  numberOfRooms: z
    .number()
    .min(1, { message: "At least one room is required" }),
});

export const SearchProfileSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  numberOfRooms: z
    .number()
    .min(1, { message: "At least one room is required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});
