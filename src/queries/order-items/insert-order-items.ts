import { QueryTypes, type Transaction } from 'sequelize';

import sequelize from '../../database.js';
import type { Item } from '../../types/index.js';

type Items = Pick<Item, 'productId' | 'quantity' | 'unitPrice'>[];

export const insertOrderItems = async (orderId: number, items: Items, transaction: Transaction): Promise<void> => {
  const values = items
    .map(({ productId, quantity, unitPrice }) => `(${orderId}, ${productId}, ${quantity}, ${unitPrice})`)
    .join(', ');

  const sql = `INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ${values}`;

  await sequelize.query(sql, { transaction, type: QueryTypes.INSERT });
};
