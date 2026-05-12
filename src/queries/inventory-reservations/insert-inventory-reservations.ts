import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../../database.js';
import type { Item } from '../../types/index.js';

export const insertInventoryReservations = async (
  orderId: number,
  warehouseId: number,
  items: Pick<Item, 'productId' | 'quantity'>[],
  transaction: Transaction,
): Promise<void> => {
  const values = items
    .map(({ productId, quantity }) => {
      return `(${orderId}, ${productId}, ${warehouseId}, ${quantity}, NOW() + INTERVAL '10 minutes')`;
    })
    .join(', ');

  const sql = `
    INSERT INTO inventory_reservations (order_id, product_id, warehouse_id, quantity, expires_at)
    VALUES ${values}
  `;

  await sequelize.query(sql, { transaction, type: QueryTypes.INSERT });
};
