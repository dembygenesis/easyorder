import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../../database.js';
import type { Customer, CustomerRow } from '../../types/index.js';

export const insertCustomer = async (
  { email, name }: Pick<Customer, 'email' | 'name'>,
  transaction: Transaction,
): Promise<number> => {
  const sql = 'INSERT INTO customers (email, name) VALUES (:email, :name) RETURNING id';

  const row = await sequelize.query<Pick<CustomerRow, 'id'>>(sql, {
    plain: true,
    replacements: {
      email,
      name,
    },
    transaction,
    type: QueryTypes.SELECT,
  });

  if (row === null) {
    throw new Error('Failed to insert customer');
  }

  return row.id;
};
