import { Schema, model } from 'mongoose';

export interface IStock {
  productId: string;
  stock: number;
}

const StockSchema = new Schema<IStock>({
  productId: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
});

const Stock = model<IStock>('Stock', StockSchema);

export default Stock;
