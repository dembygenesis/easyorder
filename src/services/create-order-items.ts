import { QueryTypes, type Transaction } from 'sequelize';

import sequelize from '../database.js';
import type { LineItem } from '../types.js';

type Input = {
  orderId: number;
  items: Pick<LineItem, 'productId' | 'quantity' | 'unitPrice'>[];
};

export const createOrderItems = async ({ orderId, lineItems }: Input, transaction: Transaction) => {
  const values = lineItems
    .map(({ productId, quantity, unitPrice }) => `\t(${orderId}, ${productId}, ${quantity}, ${unitPrice})`)
    .join('\n');

  const sql = `
    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    VALUES
    ${values} 
  `;

  await sequelize.query(sql, { transaction, type: QueryTypes.INSERT });
};
