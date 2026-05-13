import geocodeAddress from '../mocks/geocode-address.js';
import getCustomerByEmail from '../queries/customers/get-customer-by-email.js';
import insertCustomer from '../queries/customers/insert-customer.js';
import insertInventoryReservations from '../queries/inventory-reservations/insert-inventory-reservations.js';
import insertOrderItems from '../queries/order-items/insert-order-items.js';
import insertOrder from '../queries/orders/insert-order.js';
import findProducts from '../queries/products/find-products.js';
import findClosestWarehouse from '../queries/warehouses/find-closest-warehouse.js';
import sequelize from '../sequelize.js';
import type { Customer, Item } from '../types.js';
import validateOrderItems from './validate-order-items.js';

type Input = {
  customer: Pick<Customer, 'email' | 'name'>;
  items: Pick<Item, 'productId' | 'unitPrice' | 'quantity'>[];
  shipping: {
    address: string;
  };
};

const initializeOrder = async ({ customer, shipping: { address }, items }: Input): Promise<number> => {
  const { latitude, longitude } = await geocodeAddress(address);

  return sequelize.transaction(async (transaction) => {
    const products = await findProducts(
      items.map(({ productId }) => productId),
      transaction,
    );

    validateOrderItems(products, items);

    const warehouseId = await findClosestWarehouse(items, { latitude, longitude }, transaction);

    const existingCustomer = await getCustomerByEmail(customer.email);
    const customerId = existingCustomer?.id ?? (await insertCustomer(customer, transaction));

    const orderId = await insertOrder(
      { customerId, warehouseId, shipping: { address, latitude, longitude } },
      transaction,
    );

    await Promise.all([
      insertOrderItems(orderId, items, transaction),
      insertInventoryReservations(orderId, warehouseId, items, transaction),
    ]);

    return orderId;
  });
};

export default initializeOrder;
