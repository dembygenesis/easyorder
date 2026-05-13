import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../../sequelize.js';

const decrementInventory = async (orderId: number, transaction: Transaction): Promise<void> => {
  const sql = `
    UPDATE warehouse_inventory wi
    SET quantity = wi.quantity - oi.quantity, updated_at = NOW()
    FROM order_items oi
    WHERE oi.order_id = :orderId AND wi.product_id = oi.product_id
  `;

  await sequelize.query(sql, {
    replacements: { orderId },
    transaction,
    type: QueryTypes.BULKUPDATE,
  });
};

export default decrementInventory;
