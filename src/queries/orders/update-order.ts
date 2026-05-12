import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../../database.js';
import type { Order } from '../../types/index.js';

export const updateOrder = async (
  orderId: number,
  { status, paymentTransactionId }: Pick<Order, 'status' | 'paymentTransactionId'>,
  transaction?: Transaction,
): Promise<void> => {
  const sql = `
    UPDATE orders
    SET
      status = :status,
      payment_transaction_id = :paymentTransactionId,
      updated_at = NOW()
    WHERE id = :orderId
  `;

  await sequelize.query(sql, {
    replacements: { orderId, status, paymentTransactionId },
    transaction,
    type: QueryTypes.UPDATE,
  });
};
