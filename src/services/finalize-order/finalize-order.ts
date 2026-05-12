import sequelize from '../../database.js';
import { deleteInventoryReservations } from '../delete-inventory-reservations.js';
import { updateOrder } from '../update-order.js';
import { reduceInventory } from './reduce-inventory.js';

export const finalizeOrder = async (orderId: number, paymentTransactionId: string): Promise<void> => {
  await sequelize.transaction(async (transaction) => {
    await reduceInventory(orderId, transaction);
    await deleteInventoryReservations(orderId, transaction);
    await updateOrder(orderId, { status: 'paid', paymentTransactionId }, transaction);
  });
};
