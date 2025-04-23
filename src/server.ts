import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port: string | number = process.env.APP_PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
