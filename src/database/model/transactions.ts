import { Schema, model } from 'mongoose';

export interface ITransaction {
  productId: string;
  type: string;
  qty: number;
}

const TransactionSchema = new Schema<ITransaction>({
  productId: { type: String, required: true },
  type: { type: String, enum: ['order', 'refund'], required: true },
  qty: { type: Number, required: true },
});

const Transaction = model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
