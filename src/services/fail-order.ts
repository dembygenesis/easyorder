import updateOrder from '../queries/orders/update-order.js';

const failOrder = async (orderId: number): Promise<void> => {
  updateOrder(orderId, { status: 'payment_failed' });
};

export default failOrder;
