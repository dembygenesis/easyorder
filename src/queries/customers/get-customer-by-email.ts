import { QueryTypes } from 'sequelize';

import sequelize from '../../sequelize.js';

const getCustomerByEmail = async (email: string): Promise<{ id: number } | undefined> => {
  const sql = 'SELECT id FROM customers WHERE email = :email';

  const row = await sequelize.query<{ id: number }>(sql, {
    plain: true,
    replacements: { email },
    type: QueryTypes.SELECT,
  });

  if (row === null) {
    return undefined;
  }

  return row;
};

export default getCustomerByEmail;
