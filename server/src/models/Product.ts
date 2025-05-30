import { Schema, model, Document } from 'mongoose';

interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  imageURL: string;
  stockQuantity: number;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageURL: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
});

export default model<IProduct>('Product', productSchema);