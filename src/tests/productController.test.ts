import { Request, Response } from 'express';
import { findById, listAll } from '../controllers/productController';
import { calculateTransactions, calculateStock } from '../helpers/productHelper';
import { getAllStockData, getStockData, getTransactionData } from '../service/productService';

jest.mock('../helpers/productHelper', () => ({
  calculateTransactions: jest.fn(),
  calculateStock: jest.fn(),
}));

jest.mock('../service/productService', () => ({
  getStockData: jest.fn(),
  getTransactionData: jest.fn(),
  getAllStockData: jest.fn(),
}));

jest.mock('../database/model/stock', () => ({
  find: jest.fn(),
}));

describe('listAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all stock items', async () => {
    const mockStockItems = [
      { productId: 'QQO675265-24-21', stock: 100 },
      { productId: 'LTV719449-39-39', stock: 50 },
    ];

    (getAllStockData as jest.Mock).mockResolvedValue(mockStockItems);

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await listAll(res);

    expect(res.json).toHaveBeenCalledWith(mockStockItems);
  });

  it('should return 500 if there is a database error', async () => {
    (getAllStockData as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await listAll(res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Database connection failed' });
  });

  it('should return 404 if no stock items are found', async () => {
    (getAllStockData as jest.Mock).mockResolvedValue([]);

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await listAll(res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No items found in stock.' });
  });
});

describe('findById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return stock data for a valid productId', async () => {
    const mockStockData = { productId: 'QQO675265-24-21', stock: 100 };
    const mockTransactionsData = [
      { type: 'order', qty: 10 },
      { type: 'refund', qty: 5 },
    ];

    (getStockData as jest.Mock).mockResolvedValue(mockStockData);
    (getTransactionData as jest.Mock).mockResolvedValue(mockTransactionsData);
    (calculateTransactions as jest.Mock).mockReturnValue({ order: 10, refund: 5 });
    (calculateStock as jest.Mock).mockReturnValue(95);

    const req = { params: { productId: 'QQO675265-24-21' } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await findById(req, res);

    expect(res.json).toHaveBeenCalledWith({
      productId: 'QQO675265-24-21',
      originalValue: 100,
      order: 10,
      refund: 5,
      stockNumber: 95,
    });
  });

  it('should return error if productId is invalid (number instead of string)', async () => {
    const req = { params: { productId: 123456 } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await findById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid productId provided.',
    });
  });

  it('should return 404 if no stock data found for productId', async () => {
    const req = { params: { productId: 'INVALID_ID' } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    (getStockData as jest.Mock).mockResolvedValue(null);

    await findById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Product not found.',
    });
  });

  it('should return 500 if getStockData throws an error', async () => {
    (getStockData as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to get stock data');
    });

    const req = { params: { productId: 'ANY_ID' } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await findById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to get stock data' });
  });

  it('should return 500 if getTransactionData throws an error', async () => {
    (getStockData as jest.Mock).mockResolvedValue({ productId: 'ID', stock: 100 });
    (getTransactionData as jest.Mock).mockImplementation(() => {
      throw new Error('Transaction fetch error');
    });

    const req = { params: { productId: 'ID' } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await findById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Transaction fetch error' });
  });

  it('should return 500 if calculateTransactions throws an error', async () => {
    (getStockData as jest.Mock).mockResolvedValue({ productId: 'ID', stock: 100 });
    (getTransactionData as jest.Mock).mockResolvedValue([]);
    (calculateTransactions as jest.Mock).mockImplementation(() => {
      throw new Error('Transaction calculation failed');
    });

    const req = { params: { productId: 'ID' } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await findById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Transaction calculation failed' });
  });

  it('should return 500 if calculateStock throws an error', async () => {
    (getStockData as jest.Mock).mockResolvedValue({ productId: 'ID', stock: 100 });
    (getTransactionData as jest.Mock).mockResolvedValue([]);
    (calculateTransactions as jest.Mock).mockReturnValue({ order: 0, refund: 0 });
    (calculateStock as jest.Mock).mockImplementation(() => {
      throw new Error('Stock calculation failed');
    });

    const req = { params: { productId: 'ID' } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await findById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Stock calculation failed' });
  });
});
