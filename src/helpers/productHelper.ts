import { ITransaction } from '../database/model/transactions';
import { IStock } from '../database/model/stock';

export function calculateTransactions(transactions: ITransaction[]): {
  order: number;
  refund: number;
} {
  let order = 0;
  let refund = 0;

  if (!transactions || transactions.length === 0) {
    return { order, refund };
  }

  transactions.forEach(({ type, qty }) => {
    if (type === 'refund') {
      refund += qty;
    } else if (type === 'order') {
      order += qty;
    }
  });

  return { order, refund };
}

export function calculateStock(stockData: IStock, order: number, refund: number): number {
  return (stockData.stock - order) + refund;
}
