import { useState, useEffect } from 'react';
import { supabase } from '@/modules/shared/config/supabase';
import { Conversation, Message } from '@/types/market';

export function useConversations() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                setUserId(data.user.id);
                fetchConversations(data.user.id);
            }
        });
    }, []);

    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel('public:conversations')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                    filter: `vendor_id=eq.${userId}`
                },
                () => fetchConversations(userId)
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                    filter: `customer_id=eq.${userId}`
                },
                () => fetchConversations(userId)
            )
            .subscribe();

        const msgChannel = supabase.channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
                fetchConversations(userId);
            })
            .subscribe();


        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(msgChannel);
        };
    }, [userId]);

    async function fetchConversations(uid: string) {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    *,
                    request:requests (
                        event_type
                    ),
                    offer:offers (
                         price,
                         status
                    ),
                    vendor:vendor_id (
                        full_name, 
                        avatar_url
                    ),
                    customer:customer_id (
                        full_name, 
                        avatar_url
                    ),
                    messages (
                        content, 
                        created_at
                    )
                `)
                .or(`vendor_id.eq.${uid},customer_id.eq.${uid}`)
                .order('last_message_at', { ascending: false });

            if (error) throw error;

            // Map to Conversation type and handle other_party logic
            const mapped = data?.map((conv: any) => {
                const isVendor = uid === conv.vendor_id;
                return {
                    ...conv,
                    other_party: isVendor ? conv.customer : conv.vendor
                };
            });

            setConversations(mapped as unknown as Conversation[] || []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    }

    return { conversations, loading, userId };
}

export function useMessages(conversationId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        fetchMessages();

        const channel = supabase
            .channel(`conversation:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages((prev) => [...prev, newMsg]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId]);

    async function fetchMessages() {
        if (!conversationId) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setMessages(data as unknown as Message[]);
        }
        setLoading(false);
    }

    async function sendMessage(content: string, senderId: string) {
        if (!conversationId || !content.trim()) return;

        // 1. Insert message
        const { error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: senderId,
                content: content.trim()
            });

        if (error) throw error;

        // 2. Update conversation last_message_at
        await supabase
            .from('conversations')
            .update({ last_message_at: new Date().toISOString() })
            .eq('id', conversationId);
    }

    return { messages, loading, sendMessage };
}

export async function startConversation(requestId: string, offerId: string, vendorId: string, customerId: string) {
    // 1. Check if exists
    const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('request_id', requestId)
        .eq('offer_id', offerId)
        .single();

    if (existing) return existing.id;

    // 2. Create new
    const { data, error } = await supabase
        .from('conversations')
        .insert({
            request_id: requestId,
            offer_id: offerId,
            vendor_id: vendorId,
            customer_id: customerId,
            status: 'active'
        })
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
}
