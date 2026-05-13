import { ProductNotFoundError, ProductPriceMismatchError } from '../errors.js';
import type { Item, Product } from '../types.js';

const validateOrderItems = (products: Product[], items: Pick<Item, 'productId' | 'unitPrice'>[]) => {
  const productPrices = Object.fromEntries(products.map(({ id, price }) => [id, price]));

  for (const item of items) {
    const expectedPrice = productPrices[item.productId];

    if (expectedPrice === undefined) {
      throw new ProductNotFoundError(item.productId);
    }

    if (expectedPrice !== item.unitPrice) {
      throw new ProductPriceMismatchError(item.productId, expectedPrice, item.unitPrice);
    }
  }
};

export default validateOrderItems;
