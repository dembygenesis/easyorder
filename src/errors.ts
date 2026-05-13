

export class ProductNotFoundError extends Error {
  constructor(productId: number) {
    super(`Product not found: ${productId}`);
    this.name = 'ProductNotFoundError';
  }
}

export class ProductPriceMismatchError extends Error {
  constructor(productId: number, expected: number, received: number) {
    super(`Price mismatch for product ${productId}: expected ${expected}, received ${received}`);
    this.name = 'ProductPriceMismatchError';
  }
}