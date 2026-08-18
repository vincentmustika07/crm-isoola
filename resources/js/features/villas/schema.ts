import { z } from 'zod';

export const villaSchema = z.object({
    name: z
        .string()
        .min(1, 'Villa name is required')
        .max(255, 'Name must be at most 255 characters'),
    position: z
        .string()
        .min(1, 'Position is required')
        .max(50, 'Position must be at most 50 characters')
        .regex(/^[A-Za-z0-9]+$/, 'Position must contain only letters and numbers (e.g. E11)'),
    status: z.enum(['available', 'pending', 'sold'] as const, {
        message: 'Status is required',
    }),
});

export type VillaSchema = z.infer<typeof villaSchema>;
