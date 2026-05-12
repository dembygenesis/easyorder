import sequelize from '../database.js';
import { OrderTotalMismatchError } from '../errors.js';
import type { Customer, Item, Order } from '../types.js';
import { createOrUpdateCustomer } from './create-or-update-customer.js';
import { createOrderItems } from './create-order-items.js';
import { createOrder } from './create-order.js';
import { findWarehouse } from './find-warehouse.js';
import { enrichItems } from './enrich-items.js';
import { reserveInventory } from './reserve-inventory.js';

type Input = {
  customer: Pick<Customer, 'email' | 'name'>;
  items: Pick<Item, 'productId' | 'unitPrice' | 'quantity'>[];
  shippingAddress: string;
  shippingLatitude: number;
  shippingLongitude: number;
};

export const initializeOrder = async ({
  customer,
  shippingAddress,
  shippingLatitude,
  shippingLongitude,
  ...input
}: Input): Promise<Order> => {
  const order = await sequelize.transaction(async (transaction) => {
    const items = await enrichItems(input.items, transaction);

    if (items.length !== input.items.length) {
      throw new OrderTotalMismatchError();
    }

    const warehouseId = await findWarehouse(
      { items, latitude: shippingLatitude, longitude: shippingLongitude },
      transaction,
    );
    const customerId = await createOrUpdateCustomer(customer, transaction);

    const orderId = await createOrder({ customerId, warehouseId, shippingAddress }, transaction);

    await Promise.all([
      createOrderItems({ orderId, items }, transaction),
      reserveInventory({ orderId, warehouseId, items }, transaction),
    ]);

    return {
      id: orderId,
      items,
    };
  });

  return order;
};
