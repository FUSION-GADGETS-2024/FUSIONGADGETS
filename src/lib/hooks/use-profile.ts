'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth-context';
import { createClient } from '../supabase/client';

interface Profile {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
    phone: string | null;
    user_code: string | null;
    theme: string;
    currency: string;
    language: string;
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    created_at: string;
    updated_at: string;
}

interface UpdateProfileData {
    name?: string;
    phone?: string;
    avatar?: string;
    theme?: string;
    currency?: string;
    language?: string;
    email_notifications?: boolean;
    push_notifications?: boolean;
    sms_notifications?: boolean;
}

export function useProfile() {
    const { user } = useAuth();

    return useQuery<Profile>({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            if (!user) throw new Error('No user');
            
            const supabase = createClient();
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!user,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (updates: UpdateProfileData) => {
            if (!user) throw new Error('No user');
            
            const supabase = createClient();
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        },
    });
}