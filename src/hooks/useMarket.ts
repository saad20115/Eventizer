import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/modules/shared/config/supabase';
import { Request } from '@/types/market';

export interface MarketFilters {
    type?: string;
    city?: string;
    date?: string;
    budgetMin?: number;
    budgetMax?: number;
}

export function useMarket() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<MarketFilters>({});

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('requests')
                .select(`
                    *,
                    profiles:user_id (
                        full_name,
                        avatar_url
                    )
                `)
                .eq('status', 'open')
                .order('created_at', { ascending: false });

            if (filters.type) query = query.eq('event_type', filters.type);
            if (filters.city) query = query.eq('city', filters.city);
            if (filters.date) query = query.gte('event_date', filters.date);
            if (filters.budgetMin) query = query.gte('budget_max', filters.budgetMin);

            const { data, error } = await query;

            if (error) throw error;
            setRequests(data as unknown as Request[] || []);
        } catch (err: any) {
            console.error('Error fetching market requests:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return { requests, loading, error, filters, setFilters, refetch: fetchRequests };
}

export function useMarketRequest(id: string) {
    const [request, setRequest] = useState<Request | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequest = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('requests')
                .select(`
                    *,
                    profiles:user_id (
                        full_name,
                        avatar_url
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setRequest(data as unknown as Request);
        } catch (err: any) {
            console.error('Error fetching request details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchRequest();
    }, [id, fetchRequest]);

    return { request, loading, error, refetch: fetchRequest };
}

export function useMyRequests() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyRequests = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('requests')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data as unknown as Request[] || []);
        } catch (err: any) {
            console.error('Error fetching my requests:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyRequests();
    }, [fetchMyRequests]);

    return { requests, loading, error, refetch: fetchMyRequests };
}
