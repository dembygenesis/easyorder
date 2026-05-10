import { Router } from 'express';

import { createOrderSchema } from '../schemas.js';
import { CustomerUpsertError } from '../errors.js';
import { initializeOrder } from '../services/initialize-order.js';

const router = Router();

router.post('/', async (request, response) => {
  try {
    const body = createOrderSchema.safeParse(request.body);

    if (body.error) {
      console.error('Unable to parse request body:', body.error.issues);
      response.status(400).json({ message: 'The request body is invalid.' });
      return;
    }

    await initializeOrder({ items: body.data.items, shippingAddress: body.data.shipping.address, expectedTotal: 0 });

    response.json({ order: undefined });
  } catch (error) {
    if (error instanceof CustomerUpsertError) {
      console.error('Unable to create or update customer:', error.message);
      response.status(409).json({ message: 'The order could not be processed.' });
      return;
    }

    console.error('An unexpected error has occurred:', error);
    response.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

export default router;
