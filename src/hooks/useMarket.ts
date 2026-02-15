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

const PAGE_SIZE = 12;

export function useMarket() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<MarketFilters>({});
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const buildQuery = useCallback((pageParam: number) => {
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

        const from = pageParam * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        return query.range(from, to);
    }, [filters]);

    // Reset and fetch initial data when filters change
    useEffect(() => {
        const fetchInitial = async () => {
            setLoading(true);
            setPage(0);
            setHasMore(true);
            try {
                const query = buildQuery(0);
                const { data, error } = await query;

                if (error) throw error;

                const newRequests = data as unknown as Request[] || [];
                setRequests(newRequests);
                setHasMore(newRequests.length === PAGE_SIZE);
            } catch (err: any) {
                console.error('Error fetching market requests:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInitial();
    }, [buildQuery]);

    const loadMore = useCallback(async () => {
        if (!hasMore || loadingMore) return;

        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const query = buildQuery(nextPage);
            const { data, error } = await query;

            if (error) throw error;

            const newRequests = data as unknown as Request[] || [];
            if (newRequests.length > 0) {
                setRequests(prev => [...prev, ...newRequests]);
                setPage(nextPage);
                setHasMore(newRequests.length === PAGE_SIZE);
            } else {
                setHasMore(false);
            }
        } catch (err: any) {
            console.error('Error loading more requests:', err);
            setError(err.message);
        } finally {
            setLoadingMore(false);
        }
    }, [page, hasMore, loadingMore, buildQuery]);

    return {
        requests,
        loading,
        loadingMore,
        error,
        filters,
        setFilters,
        loadMore,
        hasMore,
        refetch: () => setFilters(prev => ({ ...prev })) // Trigger re-fetch by updating filters reference
    };
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
