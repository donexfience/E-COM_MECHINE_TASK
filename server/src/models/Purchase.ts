import { Schema, model, Document } from 'mongoose';

interface IPurchase extends Document {
  userId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  purchaseDate: Date;
}

const purchaseSchema = new Schema<IPurchase>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  purchaseDate: { type: Date, default: Date.now },
});

export default model<IPurchase>('Purchase', purchaseSchema);