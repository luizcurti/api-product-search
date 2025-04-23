import { Request, Response } from 'express';

import {
  calculateTransactions,
  calculateStock,
} from '../helpers/productHelper';
import { getStockData, getTransactionData, getAllStockData } from '../service/productService';

interface ProductStockResponse {
  productId: string;
  originalValue: number;
  order: number;
  refund: number;
  stockNumber: number;
}

interface StockItem {
  productId: string;
  stock: number;
}

interface ErrorResponse {
  error: string;
}

export const listAll = async (res: Response): Promise<Array<StockItem> | ErrorResponse> => {
  try {
    const allStock = await getAllStockData();

    if (allStock.length === 0) {
      const errorResponse: ErrorResponse = { error: 'No items found in stock.' };
      res.status(404).json(errorResponse);
      return errorResponse;
    }

    const successResponse: Array<StockItem> = allStock;
    res.json(successResponse);
    return successResponse;
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    const errorResponse: ErrorResponse = { error: errorMessage };
    res.status(500).json(errorResponse);
    return errorResponse;
  }
};

export const findById = async (req: Request, res: Response): Promise<ProductStockResponse | ErrorResponse> => {
  try {
    const { productId } = req.params;

    if (typeof productId !== 'string' || productId.trim() === '') {
      throw new Error('Invalid productId provided.');
    }

    const stockData = await getStockData(productId);
    if (!stockData) {
      res.status(404).json({ error: 'Product not found.' });
      return { error: 'Product not found.' };
    }

    const transactionsData = await getTransactionData(productId);
    const { order, refund } = calculateTransactions(transactionsData);
    const stockNumber = calculateStock(stockData, order, refund);

    const response: ProductStockResponse = {
      productId,
      originalValue: stockData.stock,
      order,
      refund,
      stockNumber,
    };

    res.json(response);
    return response;
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    const errorResponse: ErrorResponse = { error: errorMessage };
    res.status(500).json(errorResponse);
    return errorResponse;
  }
};
