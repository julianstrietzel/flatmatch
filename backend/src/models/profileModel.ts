import mongoose, { Schema, Types, Document } from "mongoose";
import { ILandlordAccount, ITenantAccount } from "./accountModel";
import { addressModel, IAddress } from "./addressModel";
import { Chat } from "./chatModel";
import matchingController from "../controllers/matchingController";

export interface IProfile extends Document {
  _id?: Types.ObjectId | string;
  description: string;
  type: string;
  numberOfRooms: number;
  size: number;
  requirements: {
    reqKey: string;
    weight: number;
  }[];
  tags: {
    tagKey: string;
  }[];
  images: string[];
  status?: "active" | "inactive";
}

export interface IFlatProfile extends IProfile {
  name: string;
  account: Types.ObjectId | ILandlordAccount;
  address: Types.ObjectId | IAddress;
  price: number;
  additionalCosts: number;
  totalCosts: number;
  approved: (Types.ObjectId | ISearchProfile)[];
  disapproved: (Types.ObjectId | ISearchProfile)[];
  liked_by: (Types.ObjectId | ISearchProfile)[];
}

export interface ISearchProfile extends IProfile {
  account: Types.ObjectId | ITenantAccount;
  liked: (Types.ObjectId | IFlatProfile)[];
  disliked: (Types.ObjectId | IFlatProfile)[];
  priceRange: {
    min: number;
    max: number;
  };
  city: string;
  country: string;
}

export const requirementSchema = new Schema({
  reqKey: { type: String, required: true },
  weight: { type: Number, required: true },
});

export const tagSchema = new Schema({
  tagKey: { type: String, required: true },
});

export const flatProfileSchema: Schema = new Schema<IFlatProfile>({
  account: { type: Types.ObjectId, required: true, ref: "LandlordAccount" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  tags: {
    type: [tagSchema],
    required: true,
  },
  requirements: {
    type: [requirementSchema],
    required: true,
  },
  address: { type: Types.ObjectId, required: true, ref: "Address" },
  price: { type: Number, required: true },
  additionalCosts: { type: Number, required: true },
  totalCosts: { type: Number, required: true },
  numberOfRooms: { type: Number, required: true },
  size: { type: Number, required: true },
  type: {
    type: String,
    required: true,
    enum: ["apartment", "house", "shared_flat", "loft"],
    default: "apartment",
  },
  images: { type: [String], required: true },
  approved: {
    type: [{ type: Types.ObjectId, ref: "SearchProfile" }],
    required: true,
  },
  disapproved: {
    type: [{ type: Types.ObjectId, ref: "SearchProfile" }],
    required: true,
  },
  liked_by: {
    type: [{ type: Types.ObjectId, ref: "SearchProfile" }],
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
});

flatProfileSchema.pre("deleteOne", { document: true }, async function () {
  const flatProfile = this as unknown as IFlatProfile; // needed for TS error

  // Delete address
  await addressModel.deleteOne({ _id: flatProfile.address });

  // Update search profiles
  await SearchProfile.updateMany(
    { liked: flatProfile._id },
    { $pull: { liked: flatProfile._id } }
  );
  await SearchProfile.updateMany(
    { disliked: flatProfile._id },
    { $pull: { disliked: flatProfile._id } }
  );

  // Delete associated chats
  await Chat.deleteMany({ flatProfile: flatProfile._id });
});

flatProfileSchema.pre(
  "deleteMany",
  { document: false, query: true },
  async function () {
    const conditions = this.getFilter();
    const flatProfiles = await FlatProfile.find(conditions);
    const addressIds = flatProfiles.map((flatProfile) => flatProfile.address);
    const flatProfileIds = flatProfiles.map((flatProfile) => flatProfile._id);

    // Delete addresses
    await addressModel.deleteMany({ _id: { $in: addressIds } });

    // Update search profiles
    await SearchProfile.updateMany(
      { liked: { $in: flatProfileIds } },
      { $pull: { liked: { $in: flatProfileIds } } }
    );
    await SearchProfile.updateMany(
      { disliked: { $in: flatProfileIds } },
      { $pull: { disliked: { $in: flatProfileIds } } }
    );

    // Delete associated chats
    await Chat.deleteMany({ flatProfile: { $in: flatProfileIds } });
  }
);

export const searchProfileSchema: Schema = new Schema<ISearchProfile>({
  account: { type: Types.ObjectId, required: true, ref: "TenantAccount" },
  description: { type: String, required: true },
  numberOfRooms: { type: Number, required: true },
  size: { type: Number, required: true },
  type: {
    type: String,
    required: true,
    enum: ["apartment", "house", "shared_flat", "loft"],
    default: "apartment",
  },
  tags: {
    type: [tagSchema],
    required: true,
  },
  requirements: {
    type: [requirementSchema],
    required: true,
  },
  images: { type: [String], required: true },
  liked: {
    type: [{ type: Types.ObjectId, ref: "FlatProfile" }],
    required: true,
  },
  disliked: {
    type: [{ type: Types.ObjectId, ref: "FlatProfile" }],
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

searchProfileSchema.pre("deleteOne", async function () {
  const searchProfile = this as unknown as ISearchProfile; // needed for TS error

  // Update flat profiles
  await FlatProfile.updateMany(
    { approved: searchProfile._id },
    { $pull: { approved: searchProfile._id } }
  );
  await FlatProfile.updateMany(
    { disapproved: searchProfile._id },
    { $pull: { disapproved: searchProfile._id } }
  );
  await FlatProfile.updateMany(
    { liked_by: searchProfile._id },
    { $pull: { liked_by: searchProfile._id } }
  );

  // Delete associated chats
  await Chat.deleteMany({ searchProfile: searchProfile._id });
});

searchProfileSchema.post("save", matchingController.searchPosthookFunction);
flatProfileSchema.post("save", matchingController.flatPosthookFunction);

export const SearchProfile = mongoose.model(
  "SearchProfile",
  searchProfileSchema
);

export const FlatProfile = mongoose.model("FlatProfile", flatProfileSchema);
