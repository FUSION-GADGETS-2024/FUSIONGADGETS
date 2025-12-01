import { z } from 'zod';

// Profile update validation schema
export const updateProfileSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional().or(z.literal('')),
    avatar: z.string().url().optional().or(z.literal('')),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    currency: z.string().length(3).optional(),
    language: z.string().length(2).optional(),
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    smsNotifications: z.boolean().optional(),
});

// Profile response schema
export const profileSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().nullable(),
    avatar: z.string().nullable(),
    phone: z.string().nullable(),
    theme: z.string(),
    currency: z.string(),
    language: z.string(),
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type Profile = z.infer<typeof profileSchema>;
