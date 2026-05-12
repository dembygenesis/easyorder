import type { Transaction } from 'sequelize';

export type Customer = {
  id: number;
  email: string;
  name: string;
};

export type Item = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
};

export type Warehouse = {
  id: number;
};

export type Order = {
  id: number;
  items: Item[];
  status: 'payment_pending' | 'paid' | 'payment_failed' | 'expired';
  paymentTransactionId?: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
};

export type QueryOptions = {
  transaction: Transaction;
};
