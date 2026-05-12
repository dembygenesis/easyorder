import { QueryTypes, type Transaction } from 'sequelize';

import sequelize from '../../database.js';
import type { Coordinates, Item, WarehouseRow } from '../../types/index.js';

export const findClosestWarehouse = async (
  items: Pick<Item, 'productId' | 'quantity'>[],
  { latitude, longitude }: Coordinates,
  transaction: Transaction,
): Promise<number> => {
  const conditions = items
    .map(
      () => `(
    wi.product_id = ? AND
    wi.quantity - COALESCE((
      SELECT SUM(ir.quantity)
      FROM inventory_reservations ir
      WHERE ir.warehouse_id = w.id
        AND ir.product_id = wi.product_id
        AND ir.expires_at > NOW()
    ), 0) >= ?
  )`,
    )
    .join(' OR ');

  const replacements = [
    latitude,
    longitude,
    latitude,
    ...items.reduce<number[]>((acc, { productId, quantity }) => [...acc, productId, quantity], []),
    items.length,
  ];

  const sql = `
    SELECT w.id,
      (3958.8 * ACOS(
        COS(RADIANS(?)) * COS(RADIANS(w.latitude)) *
        COS(RADIANS(w.longitude) - RADIANS(?)) +
        SIN(RADIANS(?)) * SIN(RADIANS(w.latitude))
      )) AS distance
    FROM warehouses w
    JOIN warehouse_inventory wi ON w.id = wi.warehouse_id
    WHERE ${conditions}
    GROUP BY w.id
    HAVING COUNT(DISTINCT wi.product_id) = ?
    ORDER BY distance ASC
    LIMIT 1
  `;

  const warehouse = await sequelize.query<WarehouseRow>(sql, {
    plain: true,
    replacements,
    transaction,
    type: QueryTypes.SELECT,
  });

  if (warehouse === null) {
    throw new Error('Failed to find a warehouse');
  }

  return warehouse.id;
};
