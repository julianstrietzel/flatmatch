import mongoose, { Schema, Document, Types } from "mongoose";
import { IDocument } from "./documentModel";
import { IRating, ratingSchema } from "./ratingModel";
import { IFlatProfile, ISearchProfile } from "./profileModel";
import bcrypt from "bcryptjs";


export interface IAccount extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  language: string;
  country: string;
  city: string;
  premiumUser: boolean;
  premiumEndDate?: Date | null;
  documents?: IDocument[] | Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  accountType: "tenant" | "landlord";
  profilePicture: string;
  aboutMe: string;
  emailConfirmed: boolean;
  emailConfirmationToken?: string;
}

export interface ITenantAccount extends IAccount {
  profile?: Types.ObjectId | ISearchProfile;
}

export interface ILandlordAccount extends IAccount {
  ratings?: IRating[];
  profiles: Types.ObjectId[] | IFlatProfile[];
}

/*
timestamps: true - adds createdAt and updatedAt fields to the schema
toJson:
  virtuals: true - includes any virtual propeties, such as the id field
  transform: is a function that modifies the object before it is returned, in this case it removes the password field
*/
const accountOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      delete ret.password;
    },
  },
};

const baseAccountSchema: Schema<IAccount> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    language: { type: String, required: false },
    country: { type: String, required: false },
    city: { type: String, required: false },
    premiumUser: { type: Boolean, required: true, default: false },
    premiumEndDate: { type: Date, required: false },
    documents: { type: [{ type: Types.ObjectId, ref: "Document" }], required: false },
    accountType: { type: String, required: true, enum: ["tenant", "landlord"] },
    profilePicture: { type: String, required: false },
    aboutMe: { type: String, required: false },
    emailConfirmed: { type: Boolean, default: false },
    emailConfirmationToken: { type: String, required: false },
  },
  accountOptions
);

/* Hash the password *before* saving the account, indicated by the "pre"
1. Check if the password has been modified
2. Generate a salt
3. Hash the password
*/
baseAccountSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare the entered password with the saved password
baseAccountSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const tenantAccountSchema: Schema<ITenantAccount> = new Schema({
  profile: { type: Types.ObjectId, required: false, ref: "SearchProfile" },
});

const landlordAccountSchema: Schema<ILandlordAccount> = new Schema({
  ratings: { type: [ratingSchema], required: false },
  profiles: {
    type: [{ type: Types.ObjectId, ref: "FlatProfile" }],
    required: true,
    default: [],
  },
});

// Discriminator to the base schema, the accounts will be stored in the mongodb collection "accounts"
export const AccountModel = mongoose.model<IAccount>(
  "Account",
  baseAccountSchema
);
export const TenantAccountModel = AccountModel.discriminator<ITenantAccount>(
  "TenantAccount",
  tenantAccountSchema
);
export const LandlordAccountModel =
  AccountModel.discriminator<ILandlordAccount>(
    "LandlordAccount",
    landlordAccountSchema
  );

export function isTenantAccount(account: IAccount): account is ITenantAccount {
  return (account as ITenantAccount).accountType == "tenant";
}
