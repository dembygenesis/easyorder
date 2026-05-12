import { processPayment } from '../mocks/payment.js';
import type { Order } from '../types.js';

type Input = {
  cardNumber: string;
  order: Order;
};

export type ProcessOrderPaymentResult = { success: boolean; transactionId: string };

export const processOrderPayment = async ({ cardNumber, order }: Input): Promise<ProcessOrderPaymentResult> => {
  const amount = order.items.reduce<number>((acc, { unitPrice, quantity }) => acc + unitPrice * quantity, 0);

  const lineItems = order.items
    .map(({ quantity, unitPrice, productName }) => {
      const each = (unitPrice / 100).toFixed(2);
      const total = ((unitPrice * quantity) / 100).toFixed(2);
      return `\t- ${quantity}x ${productName} ($${each} each, $${total})`;
    })
    .join('\n');

  const description = `Order #${order.id}\n${lineItems}\nTotal: $${(amount / 100).toFixed(2)}`;

  return processPayment({ cardNumber, amount, description });
};
