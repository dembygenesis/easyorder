export class AppError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
  }
}

export class ProductNotFoundError extends AppError {
  constructor(productId: number) {
    super(`Product not found: ${productId}`, 404);
  }
}

export class ProductPriceMismatchError extends AppError {
  constructor(productId: number, expected: number, received: number) {
    super(`Price mismatch for product ${productId}: expected ${expected}, received ${received}`, 400);
  }
}

export class OrderNotFoundError extends AppError {
  constructor(orderId: number) {
    super(`Order not found: ${orderId}`, 404);
  }
}

export class InvalidShippingAddressError extends AppError {
  constructor(address: string) {
    super(`Failed to extract city and state from "${address}"`, 422);
  }
}

export class UnsupportedShippingLocationError extends AppError {
  constructor(address: string) {
    super(`Failed to geocode "${address}"`, 422);
  }
}

export class NoFulfillmentWarehouseError extends AppError {
  constructor() {
    super('No warehouse can fulfill this order with the requested items and location.', 422);
  }
}

export class OrderHasNoItemsError extends AppError {
  constructor(orderId: number) {
    super(`Order has no line items: ${orderId}`, 422);
  }
}

export class OrderInsertFailedError extends AppError {
  constructor() {
    super('Failed to create order record.', 500);
  }
}

export class CustomerInsertFailedError extends AppError {
  constructor() {
    super('Failed to create customer record.', 500);
  }
}
