export class CustomerUpsertError extends Error {
  constructor() {
    super('');
    this.name = 'CustomerUpsertError';
  }
}

export class WarehouseNotFoundError extends Error {
  constructor() {
    super('');
    this.name = 'WarehouseNotFoundError';
  }
}

export class InsertOrderError extends Error {
  constructor() {
    super('');
    this.name = 'InsertOrderError';
  }
}

export class OrderTotalMismatchError extends Error {
  constructor() {
    super(`Actual order total does not match expected total`);
    this.name = 'OrderTotalMismatchError';
  }
}
