import { processPayment, type PaymentResult } from '../mocks/process-payment.js';
import type { Card, Order } from '../types/index.js';

export const processOrderPayment = async (order: Pick<Order, 'id' | 'items'>, card: Card): Promise<PaymentResult> => {
  const amount = order.items.reduce<number>((amount, { unitPrice, quantity }) => amount + unitPrice * quantity, 0);

  const description = `Payment for Order #${order.id}`;

  return processPayment({ amount, card, description });
};
