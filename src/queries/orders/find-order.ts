import { QueryTypes } from 'sequelize';

import sequelize from '../../sequelize.js';
import type { OrderRow } from '../../types.js';

type RawOrderRow = {
  id: number;
  status: 'payment_pending' | 'paid' | 'payment_failed' | 'expired';
  shipping_address: string;
  shipping_latitude: number;
  shipping_longitude: number;
  created_at: Date;
  updated_at: Date;
  customer_email: string;
  customer_name: string;
  product_id: number;
  product_name: string;
  unit_price: number;
  item_quantity: number;
};

const findOrder = async (orderId: number): Promise<OrderRow | undefined> => {
  const sql = `
    SELECT
      o.id,
      o.status,
      o.shipping_address,
      o.shipping_latitude,
      o.shipping_longitude,
      o.created_at,
      o.updated_at,
      c.email AS customer_email,
      c.name AS customer_name,
      p.id AS product_id,
      p.name AS product_name,
      oi.unit_price,
      oi.quantity AS item_quantity
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    JOIN warehouses w ON w.id = o.warehouse_id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    WHERE o.id = :orderId
  `;

  const rows = await sequelize.query<RawOrderRow>(sql, {
    replacements: { orderId },
    type: QueryTypes.SELECT,
  });

  if (rows[0] === undefined) {
    return undefined;
  }

  return {
    id: rows[0].id,
    status: rows[0].status,
    shipping_address: rows[0].shipping_address,
    shipping_latitude: rows[0].shipping_latitude,
    shipping_longitude: rows[0].shipping_longitude,
    created_at: rows[0].created_at,
    updated_at: rows[0].updated_at,
    customer_email: rows[0].customer_email,
    customer_name: rows[0].customer_name,
    items: rows.map(({ item_quantity, ...remaining }) => ({
      ...remaining,
      quantity: item_quantity,
    })),
  };
};

export default findOrder;
