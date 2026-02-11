import { useState, useEffect } from 'react';
import { supabase } from '@/modules/shared/config/supabase';
import { Offer } from '@/types/market';

export function useOffers(requestId?: string, vendorId?: string) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch offers when IDs change
    useEffect(() => {
        if (requestId || vendorId) {
            fetchOffers();
        }
    }, [requestId, vendorId]);

    async function fetchOffers() {
        setLoading(true);
        try {
            let query = supabase
                .from('offers')
                .select(`
                    *,
                    vendor:vendor_id (
                        business_name,
                        rating,
                        verified,
                        total_jobs
                    ),
                    profiles:vendor_id (
                         full_name,
                         avatar_url
                    )
                `)
                .order('price', { ascending: true }); // Lowest price first by default

            if (requestId) {
                query = query.eq('request_id', requestId);
            }
            if (vendorId) {
                query = query.eq('vendor_id', vendorId);
            }

            const { data, error } = await query;

            if (error) throw error;
            setOffers(data as unknown as Offer[] || []);
        } catch (err: any) {
            console.error('Error fetching offers:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function submitOffer(offerData: Partial<Offer>) {
        try {
            const { data, error } = await supabase
                .from('offers')
                .insert([offerData])
                .select()
                .single();

            if (error) throw error;
            await fetchOffers(); // Refresh list
            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async function updateOfferStatus(offerId: string, status: 'accepted' | 'rejected' | 'withdrawn') {
        try {
            const updates: any = { status };
            if (status === 'accepted') {
                updates.accepted_at = new Date().toISOString();
            }

            const { data, error } = await supabase
                .from('offers')
                .update(updates)
                .eq('id', offerId)
                .select()
                .single();

            if (error) throw error;
            await fetchOffers(); // Refresh
            return data;
        } catch (err: any) {
            throw err;
        }
    }

    return {
        offers,
        loading,
        error,
        refetch: fetchOffers,
        submitOffer,
        updateOfferStatus
    };
}
