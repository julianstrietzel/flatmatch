import mongoose, { Schema, Types } from "mongoose";
import { ITenantAccount } from "./accountModel";

export interface IRating {
  value: number;
  review: string;
  reviewer: Types.ObjectId | ITenantAccount;
}

export const ratingSchema: Schema = new Schema<IRating>({
  value: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: false },
  reviewer: { type: Types.ObjectId, required: true, ref: "TenantAccount" },
});

export const RatingModel = mongoose.model<IRating>("Rating", ratingSchema);
