import Stock, { IStock } from '../database/model/stock';
import Transaction, { ITransaction } from '../database/model/transactions';

interface StockItem {
  productId: string;
  stock: number;
}
export async function getAllStockData(): Promise<Array<StockItem>> {
  const allStock = await Stock.find().select('productId stock');
  if (!allStock || allStock.length === 0) {
    throw new Error('Product not found');
  }
  return allStock;
}

export async function getStockData(productId: string): Promise<IStock> {
  const stock = await Stock.findOne({ productId });
  if (!stock) {
    throw new Error('Product not found');
  }
  return stock;
}

export async function getTransactionData(productId: string): Promise<ITransaction[]> {
  return Transaction.find({ productId });
}
