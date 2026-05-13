export type Card = {
  number: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Customer = {
  id: number;
  email: string;
  name: string;
};

export type Item = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
};

export type Order = {
  id: number;
  items: Item[];
  status: 'payment_pending' | 'paid' | 'payment_failed' | 'expired';
  paymentTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
  customer: Pick<Customer, 'email' | 'name'>;
  shipping: Shipping;
};

export type OrderRow = {
  id: number;
  status: 'payment_pending' | 'paid' | 'payment_failed' | 'expired';
  shipping_address: string;
  shipping_latitude: number;
  shipping_longitude: number;
  created_at: Date;
  updated_at: Date;
  customer_email: string;
  customer_name: string;
  items: {
    product_id: number;
    product_name: string;
    unit_price: number;
    quantity: number;
  }[];
};

export type Product = {
  id: number;
  price: number;
};

export type ProductRow = {
  id: number;
  price: number;
};

export type Shipping = {
  address: string;
  coordinates: Coordinates;
};
