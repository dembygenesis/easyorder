export type Item = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
};

export type Customer = {
  email: string;
  name: string;
};

export type Order = {
  id: number;
  items: Item[];
  status: 'payment_pending' | 'paid' | 'payment_failed' | 'expired';
  paymentTransactionId?: string;
};

export type Card = {
  number: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};
