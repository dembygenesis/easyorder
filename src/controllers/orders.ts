import { Router } from 'express';

import { createOrderSchema } from '../schemas.js';
import { CustomerUpsertError } from '../errors.js';
import { initializeOrder } from '../services/initialize-order.js';
import { processOrderPayment } from '../services/process-order-payment.js';
import { geocodeAddress } from '../mocks/geocode.js';
import { finalizeOrder } from '../services/finalize-order/finalize-order.js';

const router = Router();

router.post('/', async (request, response) => {
  try {
    const body = createOrderSchema.safeParse(request.body);

    if (body.error) {
      console.error('Unable to parse request body:', body.error.issues);
      response.status(400).json({ message: 'The request body is invalid.' });
      return;
    }

    const { customer, items, shipping, payment } = body.data;

    const { latitude: shippingLatitude, longitude: shippingLongitude } = await geocodeAddress(shipping.address);

    const order = await initializeOrder({
      customer,
      items,
      shippingAddress: shipping.address,
      shippingLatitude,
      shippingLongitude,
    });

    const result = await processOrderPayment({ cardNumber: payment.cardNumber, order });

    await finalizeOrder({
      id: order.id,
      status: result.success ? 'paid' : 'payment_failed',
      paymentTransactionId: result.transactionId,
    });

    if (result.success === false) {
      response.status(401).json({ message: 'Payment failed' });
      return;
    }

    response.json({ order });
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
