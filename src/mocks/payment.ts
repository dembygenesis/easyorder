type ProcessPaymentOptions = {
  cardNumber: string;
  amount: number;
  description: string;
};

type ProcessPaymentResult = { success: true; transactionId: string } | { success: false };

export const processPayment = (options: ProcessPaymentOptions) => {
  return new Promise<ProcessPaymentResult>((resolve) => {
    setTimeout(() => {
      if (options.cardNumber.startsWith('9999')) {
        console.error('Payment failed:', options);
        resolve({ success: false });
      } else {
        console.log('Payment processed successfully:', options);
        resolve({ success: true, transactionId: `transaction_${Math.random().toString(36).substring(2)}` });
      }
    }, 5000);
  });
};
