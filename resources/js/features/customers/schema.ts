import { z } from 'zod';

export const customerSchema = z.object({
    name: z
        .string()
        .min(1, 'Customer name is required')
        .max(255, 'Name must be at most 255 characters'),
    email: z
        .string()
        .email('Invalid email format')
        .max(255, 'Email must be at most 255 characters')
        .or(z.literal(''))
        .optional(),
    phone_code: z.string().min(1, 'Country code is required'),
    phone_number: z
        .string()
        .min(5, 'Phone number must be at least 5 digits')
        .max(13, 'Phone number must be at most 13 digits')
        .regex(/^\d+$/, 'Phone number must contain only digits'),
    villa_ids: z.array(z.string()),
});

export type CustomerSchema = z.infer<typeof customerSchema>;
