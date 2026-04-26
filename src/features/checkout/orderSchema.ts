import { z } from "zod";

export const createOrderSchema = z.object({
  customerFirstName: z.string().min(2),
  customerLastName: z.string().min(2),
  phone: z.string().min(6),
  address: z.string().min(5),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        size: z.string().min(1),
        qty: z.number().int().min(1).max(99),
      }),
    )
    .min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

