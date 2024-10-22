import mongoose, { Schema } from "mongoose";

export interface IDocument {
  documentURL: string;
  documentType: string;
}

export const documentSchema: Schema = new Schema<IDocument>({
  documentURL: { type: String, required: true },
  documentType: {
    type: String,
    required: true,
    enum: ["identity", "income", "employment", "rental history", "other"],
    default: "other",
  },
});

export const DocumentModel = mongoose.model<IDocument>(
  "Document",
  documentSchema
);
