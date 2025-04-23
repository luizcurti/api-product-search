import { getAllStockData, getStockData, getTransactionData } from '../service/productService';
import Stock, { IStock } from '../database/model/stock';
import Transaction, { ITransaction } from '../database/model/transactions';

jest.mock('../database/model/stock');
jest.mock('../database/model/transactions');

describe('Product Service', () => {
  describe('getAllStockData', () => {
    it('should return all stock data', async () => {
      const mockStockData: IStock[] = [
        { productId: 'QQO675265-24-21', stock: 100 },
        { productId: 'LTV719449-39-39', stock: 50 },
      ];

      (Stock.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockStockData),
      });

      const result = await getAllStockData();
      expect(result).toEqual(mockStockData);
    });

    it('should throw an error if no stock data found', async () => {
      (Stock.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue([]),
      });

      await expect(getAllStockData()).rejects.toThrow('Product not found');
    });
  });

  describe('getStockData', () => {
    it('should return stock data for a given productId', async () => {
      const mockStock: IStock = { productId: 'QQO675265-24-21', stock: 100 };

      (Stock.findOne as jest.Mock).mockResolvedValue(mockStock);

      const result = await getStockData('QQO675265-24-21');
      expect(result).toEqual(mockStock);
    });

    it('should throw an error if product not found', async () => {
      (Stock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(getStockData('NON_EXISTENT_PRODUCT')).rejects.toThrow('Product not found');
    });
  });

  describe('getTransactionData', () => {
    it('should return transaction data for a given productId', async () => {
      const mockTransactions: ITransaction[] = [
        { productId: 'QQO675265-24-21', type: 'order', qty: 10 },
        { productId: 'QQO675265-24-21', type: 'refund', qty: 5 },
      ];

      (Transaction.find as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await getTransactionData('QQO675265-24-21');
      expect(result).toEqual(mockTransactions);
    });

    it('should return an empty array if no transactions found for the productId', async () => {
      (Transaction.find as jest.Mock).mockResolvedValue([]);

      const result = await getTransactionData('NON_EXISTENT_PRODUCT');
      expect(result).toEqual([]);
    });
  });
});
