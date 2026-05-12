import z from 'zod';

export const createOrderSchema = z.object({
  customer: z.object({
    email: z.email(),
    name: z.string().trim().min(1).max(255),
  }),
  items: z
    .array(
      z.object({
        productId: z.number().min(1),
        unitPrice: z.number().min(1),
        quantity: z.number().min(1),
      }),
    )
    .min(1),
  payment: z.object({
    card: z.object({
      number: z
        .string()
        .trim()
        .regex(/^[0-9]{16}$/, 'Invalid card number'),
    }),
  }),
  shipping: z.object({
    address: z.string().trim().min(1),
  }),
});
