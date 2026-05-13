import 'dotenv/config';

import express from 'express';

import ordersRouter from './controllers/orders.js';

const app = express();

app.use(express.json());

app.use('/orders', ordersRouter);

app
  .listen(3000)
  .on('listening', () => console.log('🚀 Relay is online at http://localhost:3000'))
  .on('error', (error) => console.error(error.message));
