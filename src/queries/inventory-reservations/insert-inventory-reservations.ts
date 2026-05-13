import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../../sequelize.js';
import type { Item } from '../../types.js';

const insertInventoryReservations = async (
  orderId: number,
  warehouseId: number,
  items: Pick<Item, 'productId' | 'quantity'>[],
  transaction: Transaction,
): Promise<void> => {
  const values = items
    .map((_, index) => `(:orderId, :productId${index}, :warehouseId, :quantity${index}, NOW() + INTERVAL '10 minutes')`)
    .join(', ');

  const itemReplacements = items.reduce<Record<string, number>>(
    (replacements, { productId, quantity }, index) => ({
      ...replacements,
      [`productId${index}`]: productId,
      [`quantity${index}`]: quantity,
    }),
    {},
  );

  const sql = `
    INSERT INTO inventory_reservations (order_id, product_id, warehouse_id, quantity, expires_at)
    VALUES ${values}
  `;

  await sequelize.query(sql, {
    replacements: {
      orderId,
      warehouseId,
      ...itemReplacements,
    },
    transaction,
    type: QueryTypes.INSERT,
  });
};

export default insertInventoryReservations;
