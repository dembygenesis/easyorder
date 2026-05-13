import processPayment, { type PaymentResult } from '../mocks/process-payment.js';
import getOrderAmount from '../queries/orders/get-order-amount.js';
import type { Card } from '../types.js';

const processOrderPayment = async (orderId: number, card: Card): Promise<PaymentResult> => {
  const amount = await getOrderAmount(orderId);

  const description = `Payment for Order #${orderId}`;

  return processPayment({ amount, card, description });
};

export default processOrderPayment;
