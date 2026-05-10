import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../database.js';
import { WarehouseNotFound } from '../errors.js';

type ReduceInventoryOptions = {
  warehouseId: number;
  items: Item[];
  transaction: Transaction;
};

type CreateOrderOptions = {
  customerId: number;
  warehouseId: number;
  shippingAddress: string;
  total: number;
  paymentConfirmationId: string;
  transaction: Transaction;
};

export const reduceInventory = async ({ warehouseId, items, transaction }: ReduceInventoryOptions): Promise<void> => {
  const cases = items.map(() => 'WHEN product_id = ? THEN quantity - ?').join('\n');

  const placeholders = items.map(() => '?').join(', ');

  const replacements = [
    ...items.reduce<number[]>((acc, { productId, quantity }) => acc.concat(productId, quantity), []),
    warehouseId,
    ...items.map(({ productId }) => productId),
  ];

  await sequelize.query(
    `
      UPDATE warehouse_inventory
      SET quantity = CASE
        ${cases}
        ELSE quantity
      END
      WHERE warehouse_id = ?
      AND product_id IN (${placeholders})
    `,
    { replacements, transaction, type: QueryTypes.UPDATE },
  );
};
