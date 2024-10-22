import mongoose, { Types, Schema, Document } from "mongoose";
import { IFlatProfile, ISearchProfile } from "./profileModel";

interface IMessage {
  content: string;
  sender: string;
  timestamp: Date;
  unread: boolean;
  documentURL?: string;
}

export interface IChat extends Document {
  messages: IMessage[];
  flatProfile: Types.ObjectId | IFlatProfile;
  searchProfile: Types.ObjectId | ISearchProfile;
  status: "new" | "active" | "inactive";
}

const chatMessageSchema: Schema = new Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true, enum: ["landlord", "tenant"] },
  timestamp: { type: Date, required: true, Default: Date.now },
  unread: { type: Boolean, default: true },
  documentURL: { type: String },
});

const chatSchema: Schema = new Schema<IChat>({
  messages: [chatMessageSchema],
  flatProfile: { type: Types.ObjectId, required: true, ref: "SearchProfile" },
  searchProfile: { type: Types.ObjectId, required: true, ref: "FlatProfile" },
  status: {
    type: String,
    required: true,
    enum: ["new", "active", "inactive"],
    default: "new",
  },
});

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
export const ChatMessage = mongoose.model<IMessage>(
  "ChatMessage",
  chatMessageSchema
);
