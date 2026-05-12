import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../database.js';
import type { Customer } from '../types.js';
import { CustomerUpsertError } from '../errors.js';

type Input = Pick<Customer, 'email' | 'name'>;

export const createOrUpdateCustomer = async ({ email, name }: Input, transaction: Transaction): Promise<number> => {
  const sql = `
    INSERT INTO customers (email, name)
    VALUES (:email, :name)
    ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
    RETURNING id
  `;

  const customer = await sequelize.query<Pick<Customer, 'id'>>(sql, {
    plain: true,
    replacements: {
      email,
      name,
    },
    transaction,
    type: QueryTypes.SELECT,
  });

  if (customer === null) {
    throw new CustomerUpsertError();
  }

  return customer.id;
};
