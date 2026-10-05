import { z } from 'zod';

export const createCheckSchema = z.object({
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'VIN must contain 17 valid characters'),
});
