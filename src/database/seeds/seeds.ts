import connectMongoDB from '../mongoConnect';
import Stock, { IStock } from '../model/stock';
import Transaction, { ITransaction } from '../model/transactions';

import stockJson from './stock.json';
import transactionJson from './transactions.json';

async function seedDatabase(): Promise<void> {
  try {
    await connectMongoDB();

    await Stock.deleteMany({});
    await Transaction.deleteMany({});

    if (stockJson.length === 0) throw new Error('Stock JSON is empty!');
    if (transactionJson.length === 0) throw new Error('Transaction JSON is empty!');

    const insertedStock = await Stock.insertMany<IStock>(stockJson);
    console.log(`Inserted ${insertedStock.length} stock records.`);

    const insertedTransactions = await Transaction.insertMany<ITransaction>(transactionJson);
    console.log(`Inserted ${insertedTransactions.length} transaction records.`);

    console.log('Database successfully populated!');
    process.exit(0);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error populating the database:', err.message);
    } else {
      console.error('Error populating the database:', String(err));
    }
    process.exit(1);
  }
}

seedDatabase();
