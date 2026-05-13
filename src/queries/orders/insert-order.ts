import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../../sequelize.js';

type InseretOrderParams = {
  customerId: number;
  warehouseId: number;
  shipping: {
    address: string;
    latitude: number;
    longitude: number;
  };
};

const insertOrder = async (
  { customerId, warehouseId, shipping }: InseretOrderParams,
  transaction: Transaction,
): Promise<number> => {
  const sql = `
    INSERT INTO orders (customer_id, warehouse_id, shipping_address, shipping_latitude, shipping_longitude)
    VALUES (:customerId, :warehouseId, :address, :latitude, :longitude)
    RETURNING id
  `;

  const row = await sequelize.query<{ id: number }>(sql, {
    plain: true,
    replacements: { customerId, warehouseId, ...shipping },
    transaction,
    type: QueryTypes.SELECT,
  });

  if (row === null) {
    throw new Error('TODO');
  }

  return row.id;
};

export default insertOrder;
