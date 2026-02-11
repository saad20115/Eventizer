import { useState, useEffect } from 'react';
import { supabase } from '@/modules/shared/config/supabase';
import { Transaction } from '@/types/market';

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    async function fetchTransactions() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch for both vendor (from offers) and customer (from requests)
            // This is a bit complex with RLS, but the RLS policy I wrote handles it.
            // "Users can view own transactions" checks both request_id->user_id and offer_id->vendor_id.

            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    request:requests (
                        event_type
                    ),
                    offer:offers (
                        price
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTransactions(data as unknown as Transaction[] || []);
        } catch (err: any) {
            console.error('Error fetching transactions:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { transactions, loading, error, refetch: fetchTransactions };
}
