import { QueryTypes } from 'sequelize';

import sequelize from '../../sequelize.js';

const getOrderAmount = async (orderId: number) => {
  const sql = 'SELECT SUM(unit_price * quantity) AS amount FROM order_items WHERE order_id = :orderId';

  const row = await sequelize.query<{ amount: number }>(sql, {
    plain: true,
    replacements: { orderId },
    type: QueryTypes.SELECT,
  });

  if (row === null) {
    throw new Error('TODO');
  }

  console.log('TODO:', typeof row.amount, row.amount);

  return row.amount;
};

export default getOrderAmount;
