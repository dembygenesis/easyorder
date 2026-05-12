import sequelize from '../database.js';
import { insertCustomer } from '../queries/customers/insert-customer.js';
import { insertInventoryReservations } from '../queries/inventory-reservations/insert-inventory-reservations.js';
import { insertOrderItems } from '../queries/order-items/insert-order-items.js';
import { insertOrder } from '../queries/orders/insert-order.js';
import { findClosestWarehouse } from '../queries/warehouses/find-closest-warehouse.js';
import type { Coordinates, Customer, Item } from '../types/index.js';

type Input = {
  customer: Pick<Customer, 'email' | 'name'>;
  items: Pick<Item, 'productId' | 'unitPrice' | 'quantity'>[];
  shipping: {
    address: string;
    coordinates: Coordinates;
  };
};

export const initializeOrder = async ({ customer, shipping, items }: Input): Promise<void> => {
  await sequelize.transaction(async (transaction) => {
    const warehouseId = await findClosestWarehouse(items, shipping.coordinates, transaction);
    const customerId = await insertCustomer(customer, transaction);
    const orderId = await insertOrder({ customerId, warehouseId, shippingAddress: shipping.address }, transaction);

    await Promise.all([
      insertOrderItems(orderId, items, transaction),
      insertInventoryReservations(orderId, warehouseId, items, transaction),
    ]);
  });
};
