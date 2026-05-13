import mapOrderRow from '../mappers/map-order-row.js';
import findOrder from '../queries/orders/find-order.js';
import type { Order } from '../types.js';

const getOrder = async (orderId: number): Promise<Order> => {
  const row = await findOrder(orderId);

  if (row === undefined) {
    throw new Error('');
  }

  return mapOrderRow(row);
};

export default getOrder;
