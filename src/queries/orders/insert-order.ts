import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../../database.js';
import type { OrderRow } from '../../types/rows.js';

type Order = {
  customerId: number;
  warehouseId: number;
  shippingAddress: string;
};

export const insertOrder = async (
  { customerId, warehouseId, shippingAddress }: Order,
  transaction: Transaction,
): Promise<number> => {
  const sql = `
    INSERT INTO orders (customer_id, warehouse_id, shipping_address)
    VALUES (:customerId, :warehouseId, :shippingAddress)
    RETURNING id
  `;

  const row = await sequelize.query<Pick<OrderRow, 'id'>>(sql, {
    plain: true,
    replacements: {
      customerId,
      warehouseId,
      shippingAddress,
    },
    transaction,
    type: QueryTypes.SELECT,
  });

  if (row === null) {
    throw new Error('Failed to insert order');
  }

  return row.id;
};
