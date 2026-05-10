import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../database.js';
import type { Item } from '../types.js';

type Row = {
  product_id: number;
  unit_price: number;
  quantity: number;
};

export const enrichItems = async (items: Item[], transaction: Transaction): Promise<Item[]> => {
  const values = items.map(({ productId, quantity }) => `(${productId}, ${quantity})`).join(', ');

  const sql = `
    SELECT products.id AS product_id, products.price AS unit_price, items.quantity
    FROM products
    JOIN (VALUES ${values}) AS items(product_id, quantity)
    ON products.id = items.product_id
    WHERE products.price = items.unit_price
  `;

  const rows = await sequelize.query<Row>(sql, {
    transaction,
    type: QueryTypes.SELECT,
  });

  return rows.map(({ product_id: productId, unit_price: unitPrice, ...row }) => ({ ...row, productId, unitPrice }));
};
