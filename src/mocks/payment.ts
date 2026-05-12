type ProcessPaymentOptions = {
  cardNumber: string;
  amount: number;
  description: string;
};

type ProcessPaymentResult = { success: boolean; transactionId: string };

export const processPayment = (options: ProcessPaymentOptions) => {
  return new Promise<ProcessPaymentResult>((resolve) => {
    setTimeout(() => {
      const transactionId = `transaction_${Math.random().toString(36).substring(2)}`;
      if (options.cardNumber.startsWith('9999')) {
        console.error('Payment failed:', options);
        resolve({ success: false, transactionId });
      } else {
        console.log('Payment processed successfully:', options);
        resolve({ success: true, transactionId });
      }
    }, 5000);
  });
};
