import type { Order, OrderRow } from '../types.js';

const mapOrderRow = (row: OrderRow): Order => ({
  id: row.id,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  customer: {
    email: row.customer_email,
    name: row.customer_name,
  },
  shipping: {
    address: row.shipping_address,
    coordinates: {
      latitude: row.shipping_latitude,
      longitude: row.shipping_longitude,
    },
  },
  items: row.items.map((item) => ({
    productId: item.product_id,
    productName: item.product_name,
    unitPrice: item.unit_price,
    quantity: item.quantity,
  })),
});

export default mapOrderRow;
