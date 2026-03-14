import Stock, { IStock } from '../database/model/stock';
import Transaction, { ITransaction } from '../database/model/transactions';

interface StockItem {
  productId: string;
  stock: number;
}
export async function getAllStockData(): Promise<Array<StockItem>> {
  const allStock = await Stock.find().select('productId stock');
  return allStock ?? [];
}

export async function getStockData(productId: string): Promise<IStock | null> {
  const stock = await Stock.findOne({ productId });
  return stock ?? null;
}

export async function getTransactionData(productId: string): Promise<ITransaction[]> {
  return Transaction.find({ productId });
}
