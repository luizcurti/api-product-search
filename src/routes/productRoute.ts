import express, { Request, Response } from 'express';
import { findById, listAll } from '../controllers/productController';
import { validateProductId } from '../middlewares/validateProductId';

const router = express.Router();

router.get('/product/:productId', validateProductId, async (req: Request, res: Response) => {
  await findById(req, res);
});

router.get('/product/', async (req: Request, res: Response) => {
  await listAll(req, res);
});

export default router;
