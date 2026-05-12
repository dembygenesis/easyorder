import sequelize from '../database.js';
import { deleteInventoryReservations } from '../queries/inventory-reservations/delete-inventory-reservations.js';
import { decrementInventory } from '../queries/inventory/decrement-inventory.js';
import { updateOrder } from '../queries/orders/update-order.js';

export const completeOrder = async (orderId: number, paymentTransactionId: string): Promise<void> => {
  await sequelize.transaction(async (transaction) => {
    await decrementInventory(orderId, transaction);
    await deleteInventoryReservations(orderId, transaction);
    await updateOrder(orderId, { status: 'paid', paymentTransactionId }, transaction);
  });
};
