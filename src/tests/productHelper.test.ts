import { calculateTransactions, calculateStock } from '../helpers/productHelper';
import { ITransaction } from '../database/model/transactions';
import { IStock } from '../database/model/stock';

describe('calculateTransactions', () => {
  it('should correctly calculate order and refund totals', () => {
    const transactions: ITransaction[] = [
      { type: 'order', qty: 10, productId: '' },
      { type: 'refund', qty: 5, productId: '' },
      { type: 'order', qty: 20, productId: '' },
    ];
    const result = calculateTransactions(transactions);
    expect(result).toEqual({ order: 30, refund: 5 });
  });

  it('should return 0s when no transactions are passed', () => {
    const result = calculateTransactions([]);
    expect(result).toEqual({ order: 0, refund: 0 });
  });

  it('should return 0s when transactions is undefined', () => {
    const result = calculateTransactions(undefined as unknown as ITransaction[]);
    expect(result).toEqual({ order: 0, refund: 0 });
  });
});

describe('calculateStock', () => {
  it('should return correct stock after applying order and refund', () => {
    const stockData: IStock = { productId: 'A', stock: 100 };
    const result = calculateStock(stockData, 40, 10);
    expect(result).toBe(70);
  });
});
