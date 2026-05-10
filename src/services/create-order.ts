import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../database.js';
import { InsertOrderError } from '../errors.js';
import type { Order } from '../types.js';

type Input = {
  customerId: number;
  warehouseId: number;
  shippingAddress: string;
};

export const createOrder = async (input: Input, transaction: Transaction): Promise<number> => {
  const { customerId, warehouseId, shippingAddress } = input;

  const sql = `
    INSERT INTO orders (customer_id, warehouse_id, shipping_address)
    VALUES (:customerId, :warehouseId, :shippingAddress)
    RETURNING id
  `;

  const order = await sequelize.query<Order>(sql, {
    plain: true,
    replacements: {
      customerId,
      warehouseId,
      shippingAddress,
    },
    transaction,
    type: QueryTypes.SELECT,
  });

  if (order === null) {
    throw new InsertOrderError();
  }

  return order.id;
};
