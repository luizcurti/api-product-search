import express, { Express } from 'express';
import connectMongoDB from './database/mongoConnect';
import productIdRoutes from './routes/productRoute';

class App {
  app: Express;

  constructor() {
    this.app = express();
    this.connectDB();
    this.middlewares();
    this.routes();
  }

  private connectDB(): void {
    connectMongoDB();
  }

  private middlewares(): void {
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use('/', productIdRoutes);
  }
}

export default new App().app;
