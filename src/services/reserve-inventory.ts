import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../database.js';
import type { Item } from '../types.js';

type Input = {
  orderId: number;
  warehouseId: number;
  items: Pick<Item, 'productId' | 'quantity'>[];
};

export const reserveInventory = async ({ orderId, warehouseId, items }: Input, transaction: Transaction) => {
  const values = items
    .map(({ productId, quantity }) => `\t(${orderId}, ${productId}, ${warehouseId}, ${quantity})`)
    .join('\n');

  const sql = `
    INSERT INTO inventory_reservations (order_id, product_id, warehouse_id, quantity)
    VALUES
    ${values}
  `;

  await sequelize.query(sql, { transaction, type: QueryTypes.INSERT });
};
