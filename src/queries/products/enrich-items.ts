import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../../database.js';
import type { Item } from '../../types/types.js';

type Items = Pick<Item, 'productId' | 'unitPrice' | 'quantity'>[];

type Row = {
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export const _ = async (items: Items, transaction: Transaction): Promise<Item[]> => {
  const values = items
    .map(({ productId, unitPrice, quantity }) => `(${productId}, ${unitPrice}, ${quantity})`)
    .join(', ');

  const sql = `
    SELECT products.id AS product_id, products.name AS product_name, products.price AS unit_price, items.quantity
    FROM products
    JOIN (VALUES ${values}) AS items(product_id, unit_price, quantity)
    ON products.id = items.product_id
    WHERE products.price = items.unit_price
  `;

  const rows = await sequelize.query<Row>(sql, {
    transaction,
    type: QueryTypes.SELECT,
  });

  return rows.map(({ product_id: productId, product_name: productName, unit_price: unitPrice, ...row }) => ({
    ...row,
    productId,
    productName,
    unitPrice,
  }));
};
