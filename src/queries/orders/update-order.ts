import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../../sequelize.js';
import type { Order } from '../../types.js';

const updateOrder = async (
  orderId: number,
  { status, paymentTransactionId }: Pick<Order, 'status' | 'paymentTransactionId'>,
  transaction?: Transaction,
): Promise<void> => {
  const sql = `
    UPDATE orders
    SET
      status = :status,
      ${paymentTransactionId ? 'payment_transaction_id = :paymentTransactionId,' : ''}
      updated_at = NOW()
    WHERE id = :orderId
  `;

  await sequelize.query(sql, {
    replacements: { orderId, status, paymentTransactionId },
    transaction,
    type: QueryTypes.UPDATE,
  });
};

export default updateOrder;
