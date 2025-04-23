import express, { Request, Response } from 'express';
import { findById, listAll } from '../controllers/productController';

const router = express.Router();

router.get('/product/:productId', async (req: Request, res: Response) => {
  await findById(req, res);
});

router.get('/product/', async (req: Request, res: Response) => {
  await listAll(res);
});

export default router;
