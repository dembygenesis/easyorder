import { QueryTypes, type Transaction } from 'sequelize';

import sequelize from '../database.js';
import { WarehouseNotFoundError } from '../errors.js';
import type { Item, Warehouse } from '../types.js';

type Input = {
  items: Item[];
};

export const findWarehouse = async ({ items }: Input, transaction: Transaction): Promise<number> => {
  const conditions = items.map(() => '(wi.product_id = ? AND wi.quantity >= ?)').join(' OR ');

  const replacements = [
    ...items.reduce<number[]>((acc, { productId, quantity }) => [...acc, productId, quantity], []),
    items.length,
  ];

  const sql = `
    SELECT w.id FROM warehouses w
    JOIN warehouse_inventory wi
    ON w.id = wi.warehouse_id
    WHERE ${conditions}
    GROUP BY w.id
    HAVING COUNT(DISTINCT wi.product_id) = ?
  `;

  const warehouse = await sequelize.query<Warehouse>(sql, {
    plain: true,
    replacements,
    transaction,
    type: QueryTypes.SELECT,
  });

  if (warehouse === null) {
    throw new WarehouseNotFoundError();
  }

  return warehouse.id;
};
