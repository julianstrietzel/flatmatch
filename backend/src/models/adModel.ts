import mongoose, {Schema} from "mongoose";

export interface IAd {
  title: string;
  description: string;
  tags: {
    tagKey: string;
  }[];
  image: string;
  url: string;
}

const tagSchema = new Schema({
  tagKey: { type: String, required: true },
});

const adSchema: Schema = new Schema<IAd>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: {
    type: [tagSchema],
    required: true,
    default: [],
  },
  image: { type: String, required: true },
  url: { type: String, required: true },
})

export const AdModel = mongoose.model("Ad", adSchema);
