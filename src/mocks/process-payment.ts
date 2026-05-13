import delay from './delay.js';

type ProcessPaymentParams = {
  amount: number;
  card: {
    number: string;
  };
  description: string;
};

export type PaymentResult = {
  success: boolean;
  id: string;
};

const DECLINED_CARD_NUMBERS = ['6666666666666666', '9999999999999999'];

const processPayment = async ({ amount, card, description }: ProcessPaymentParams): Promise<PaymentResult> => {
  console.log(`POST https://api.easypay.com/payments`, { amount, card, description });

  await delay(5000);

  const id = `transaction_${Math.random().toString(36).substring(2)}`;

  if (DECLINED_CARD_NUMBERS.includes(card.number)) {
    console.error(`402 https://api.easypay.com/payments`, { id, amount, card, description });
    return { success: false, id };
  }

  console.log(`200 https://api.easypay.com/payments`, { id, amount, card, description });
  return { success: true, id };
};

export default processPayment;
