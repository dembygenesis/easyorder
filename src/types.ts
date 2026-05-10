import type { Transaction } from 'sequelize';

export type Customer = {
  id: number;
  email: string;
  name: string;
};

export type Item = {
  productId: number;
  unitPrice: number;
  quantity: number;
};

export type Warehouse = {
  id: number;
};

export type Order = {
  id: number;
};

export type Product = {
  id: number;
};

export type QueryOptions = {
  transaction: Transaction;
};
