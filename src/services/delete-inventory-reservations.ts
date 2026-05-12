import { QueryTypes, type Transaction } from 'sequelize';

import sequelize from '../database.js';

export const deleteInventoryReservations = async (orderId: number, transaction: Transaction): Promise<void> => {
  await sequelize.query('DELETE FROM inventory_reservations WHERE order_id = :orderId', {
    replacements: { orderId },
    transaction,
    type: QueryTypes.BULKDELETE,
  });
};
