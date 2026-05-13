import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '../../sequelize.js';
import type { ProductRow } from '../../types.js';

const findProducts = async (productIds: number[], transaction: Transaction): Promise<ProductRow[]> => {
  const sql = 'SELECT id, price FROM products WHERE id IN (:productIds)';

  return await sequelize.query<ProductRow>(sql, {
    replacements: { productIds },
    transaction,
    type: QueryTypes.SELECT,
  });
};

export default findProducts;
