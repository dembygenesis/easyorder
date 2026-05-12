import { QueryTypes, type Transaction } from 'sequelize';

import sequelize from '../database.js';
import type { Item } from '../types.js';

type Input = {
  orderId: number;
  items: Pick<Item, 'productId' | 'quantity' | 'unitPrice'>[];
};

export const createOrderItems = async ({ orderId, items }: Input, transaction: Transaction): Promise<void> => {
  const values = items
    .map(({ productId, quantity, unitPrice }) => `\t(${orderId}, ${productId}, ${quantity}, ${unitPrice})`)
    .join(',\n');

  const sql = `
    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    VALUES
    ${values} 
  `;

  await sequelize.query(sql, { transaction, type: QueryTypes.INSERT });
};
