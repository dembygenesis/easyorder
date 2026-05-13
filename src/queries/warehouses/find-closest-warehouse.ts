import { QueryTypes, type Transaction } from 'sequelize';

import sequelize from '../../sequelize.js';
import type { Coordinates, Item } from '../../types.js';

const findClosestWarehouse = async (
  items: Pick<Item, 'productId' | 'quantity'>[],
  { latitude, longitude }: Coordinates,
  transaction: Transaction,
): Promise<number> => {
  const conditions = items
    .map(
      (_, index) => `(
        wi.product_id = :productId${index} AND
        wi.quantity - COALESCE((
          SELECT SUM(ir.quantity)
          FROM inventory_reservations ir
          WHERE ir.warehouse_id = w.id
            AND ir.product_id = wi.product_id
            AND ir.expires_at > NOW()
        ), 0) >= :quantity${index}
      )`,
    )
    .join(' OR ');

  const itemReplacements = items.reduce<Record<string, number>>(
    (replacements, { productId, quantity }, index) => ({
      ...replacements,
      [`productId${index}`]: productId,
      [`quantity${index}`]: quantity,
    }),
    {},
  );

  const sql = `
    SELECT w.id,
      (3958.8 * ACOS(
        COS(RADIANS(:latitude)) * COS(RADIANS(w.latitude)) *
        COS(RADIANS(w.longitude) - RADIANS(:longitude)) +
        SIN(RADIANS(:latitude)) * SIN(RADIANS(w.latitude))
      )) AS distance
    FROM warehouses w
    JOIN warehouse_inventory wi ON w.id = wi.warehouse_id
    WHERE ${conditions}
    GROUP BY w.id
    HAVING COUNT(DISTINCT wi.product_id) = :itemCount
    ORDER BY distance ASC
    LIMIT 1
  `;

  const row = await sequelize.query<{ id: number }>(sql, {
    plain: true,
    replacements: { latitude, longitude, itemCount: items.length, ...itemReplacements },
    transaction,
    type: QueryTypes.SELECT,
  });

  if (row === null) {
    throw new Error('TODO');
  }

  return row.id;
};

export default findClosestWarehouse;
