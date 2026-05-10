import 'dotenv/config';

import express from 'express';

import ordersRouter from './controllers/orders.js';

const app = express();

const port = 3000;

app.use(express.json());

app.use('/orders', ordersRouter);

app.listen(port, (error) => {
  if (error) {
    console.error('EasyOrder could not be started:', error);
  } else {
    console.log(`EasyOrder is running on port ${port}`);
  }
});
