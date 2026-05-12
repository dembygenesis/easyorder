import sequelize from '../database.js';
import { deleteInventoryReservations } from '../queries/inventory-reservations/delete-inventory-reservations.js';
import { updateOrder } from '../queries/orders/update-order.js';

export const expireOrder = async (orderId: number): Promise<void> => {
  await sequelize.transaction(async (transaction) => {
    await deleteInventoryReservations(orderId, transaction);
    await updateOrder(orderId, { status: 'expired' }, transaction);
  });
};
