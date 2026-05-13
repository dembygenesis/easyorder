import { QueryTypes, Transaction } from 'sequelize';

import { CustomerInsertFailedError } from '../../errors.js';
import sequelize from '../../sequelize.js';
import type { Customer } from '../../types.js';

const insertCustomer = async (
  { email, name }: Pick<Customer, 'email' | 'name'>,
  transaction: Transaction,
): Promise<number> => {
  const sql = 'INSERT INTO customers (email, name) VALUES (:email, :name) RETURNING id';

  const row = await sequelize.query<{ id: number }>(sql, {
    plain: true,
    replacements: { email, name },
    transaction,
    type: QueryTypes.SELECT,
  });

  if (row === null) {
    throw new CustomerInsertFailedError();
  }

  return row.id;
};

export default insertCustomer;
