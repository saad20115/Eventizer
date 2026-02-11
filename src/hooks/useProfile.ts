import { useEffect, useState } from 'react';
import { supabase } from '@/modules/shared/config/supabase';

export interface Profile {
    id: string;
    full_name: string | null;
    phone: string | null;
    role: 'customer' | 'vendor' | 'admin';
    avatar_url: string | null;
    email?: string;
}

export function useProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setProfile(null);
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                throw error;
            }

            setProfile({ ...data, email: user.email });
        } catch (err: any) {
            console.error('Error fetching profile:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user logged in');

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            await fetchProfile(); // Refresh data
            return { success: true };
        } catch (err: any) {
            console.error('Error updating profile:', err);
            return { success: false, error: err.message };
        }
    };

    return { profile, loading, error, updateProfile, refreshProfile: fetchProfile };
}
