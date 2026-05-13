import { Router } from 'express';

import { AppError } from '../errors.js';
import { createOrderSchema } from '../schemas.js';
import completeOrder from '../services/complete-order.js';
import failOrder from '../services/fail-order.js';
import initializeOrder from '../services/initialize-order.js';
import processOrderPayment from '../services/process-order-payment.js';
import getOrder from '../services/get-order.js';

const router = Router();

router.post('/', async (request, response) => {
  try {
    const body = createOrderSchema.safeParse(request.body);

    if (!body.success) {
      console.error('Unable to parse request body:', body.error.issues);
      response.status(400).json({ message: 'The request body is invalid.' });
      return;
    }

    const { customer, items, shipping, payment } = body.data;

    const orderId = await initializeOrder({ customer, items, shipping });

    const paymentResult = await processOrderPayment(orderId, payment.card);

    if (paymentResult.success) {
      await completeOrder(orderId, paymentResult.id);
    } else {
      await failOrder(orderId);
    }

    const order = await getOrder(orderId);

    if (!paymentResult.success) {
      response.status(402).json({ message: 'Payment was declined.', order });
      return;
    }

    response.status(201).json({ order });
  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode >= 500) {
        console.error('An unexpected error has occurred:', error);
      }
      response.status(error.statusCode).json({ message: error.message });
      return;
    }

    console.error('An unexpected error has occurred:', error);
    response.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

export default router;
