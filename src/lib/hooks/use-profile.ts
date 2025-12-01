'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth-context';

interface Profile {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    phone: string | null;
    theme: string;
    currency: string;
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    createdAt: string;
    updatedAt: string;
}

interface UpdateProfileData {
    name?: string;
    phone?: string;
    avatar?: string;
    theme?: string;
    currency?: string;
    language?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
}

export function useProfile() {
    const { user } = useAuth();

    return useQuery<Profile>({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            const response = await fetch('/api/profile');
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            const data = await response.json();
            return data.data;
        },
        enabled: !!user,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (updates: UpdateProfileData) => {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update profile');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        },
    });
}
