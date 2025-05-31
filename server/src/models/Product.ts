import { Schema, model, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  imageURL: string;
  stockQuantity: number;
  status: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageURL: { type: String, required: true },
    stockQuantity: { type: Number, required: true },
    status: { type: String, required: true, default: "active" },
  },
  {
    timestamps: true,
  }
);

export default model<IProduct>("Product", productSchema);
