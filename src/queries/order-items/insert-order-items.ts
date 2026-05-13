import { QueryTypes, type Transaction } from 'sequelize';

import sequelize from '../../sequelize.js';
import type { Item } from '../../types.js';

type Items = Pick<Item, 'productId' | 'quantity' | 'unitPrice'>[];

const insertOrderItems = async (orderId: number, items: Items, transaction: Transaction): Promise<void> => {
  const values = items
    .map((_, index) => `(:orderId, :productId${index}, :quantity${index}, :unitPrice${index})`)
    .join(', ');

  const itemReplacements = items.reduce<Record<string, number>>(
    (replacements, { productId, quantity, unitPrice }, index) => ({
      ...replacements,
      [`productId${index}`]: productId,
      [`quantity${index}`]: quantity,
      [`unitPrice${index}`]: unitPrice,
    }),
    {},
  );

  const sql = `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ${values}`;

  await sequelize.query(sql, {
    replacements: {
      orderId,
      ...itemReplacements,
    },
    transaction,
    type: QueryTypes.INSERT,
  });
};

export default insertOrderItems;
