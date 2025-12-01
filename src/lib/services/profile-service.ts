import { createClient } from '../supabase/server';

export interface ProfileServiceResponse {
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

export interface UpdateProfileData {
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

/**
 * Get user profile
 */
export async function getProfile(userId: string): Promise<ProfileServiceResponse | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) {
        return null;
    }

    return transformProfile(data);
}

/**
 * Update user profile
 */
export async function updateProfile(
    userId: string,
    updates: UpdateProfileData
): Promise<ProfileServiceResponse> {
    const supabase = await createClient();

    // Transform camelCase to snake_case for database
    const dbUpdates: any = {
        updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone || null;
    if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar || null;
    if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
    if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
    if (updates.language !== undefined) dbUpdates.language = updates.language;
    if (updates.emailNotifications !== undefined) dbUpdates.email_notifications = updates.emailNotifications;
    if (updates.pushNotifications !== undefined) dbUpdates.push_notifications = updates.pushNotifications;
    if (updates.smsNotifications !== undefined) dbUpdates.sms_notifications = updates.smsNotifications;

    const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId)
        .select()
        .single();

    if (error || !data) {
        throw new Error('Failed to update profile');
    }

    // Also update auth user metadata for name
    if (updates.name !== undefined) {
        await supabase.auth.updateUser({
            data: { name: updates.name }
        });
    }

    return transformProfile(data);
}

/**
 * Create user profile (called by trigger on signup)
 */
export async function createProfile(
    userId: string,
    email: string,
    name?: string
): Promise<ProfileServiceResponse> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .insert({
            id: userId,
            email,
            name: name || email.split('@')[0],
        })
        .select()
        .single();

    if (error || !data) {
        throw new Error('Failed to create profile');
    }

    return transformProfile(data);
}

/**
 * Transform database profile to service response format
 */
function transformProfile(dbProfile: any): ProfileServiceResponse {
    return {
        id: dbProfile.id,
        email: dbProfile.email,
        name: dbProfile.name,
        avatar: dbProfile.avatar,
        phone: dbProfile.phone,
        theme: dbProfile.theme || 'system',
        currency: dbProfile.currency || 'INR',
        language: dbProfile.language || 'en',
        emailNotifications: dbProfile.email_notifications ?? true,
        pushNotifications: dbProfile.push_notifications ?? true,
        smsNotifications: dbProfile.sms_notifications ?? false,
        createdAt: dbProfile.created_at,
        updatedAt: dbProfile.updated_at,
    };
}
