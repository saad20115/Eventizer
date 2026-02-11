-- 1. Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES public.requests(id) NOT NULL,
    vendor_id UUID REFERENCES public.profiles(id) NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(request_id, vendor_id) -- Ensure one conversation per vendor per request
);
-- 2. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- 3. Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- 4. RLS for conversations
-- Users can view conversations they are part of
CREATE POLICY "Users can view own conversations" ON public.conversations FOR
SELECT USING (
        auth.uid() = vendor_id
        OR auth.uid() = customer_id
    );
-- Admin view (Generic policy, adjust based on actual admin role implementation)
-- CREATE POLICY "Admins can view all conversations" ON public.conversations
--    FOR SELECT USING (auth.role() = 'service_role'); -- OR specific admin check
-- 5. RLS for messages
-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in own conversations" ON public.messages FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.conversations
            WHERE conversations.id = messages.conversation_id
                AND (
                    conversations.vendor_id = auth.uid()
                    OR conversations.customer_id = auth.uid()
                )
        )
    );
-- Users can insert messages in their conversations
CREATE POLICY "Users can insert messages in own conversations" ON public.messages FOR
INSERT WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1
            FROM public.conversations
            WHERE conversations.id = conversation_id
                AND (
                    conversations.vendor_id = auth.uid()
                    OR conversations.customer_id = auth.uid()
                )
        )
    );
-- 6. Update requests RLS to allow public/vendors to view open requests
CREATE POLICY "Anyone can view open requests" ON public.requests FOR
SELECT USING (status = 'open');
-- 7. Enable Realtime
-- Note: You might need to run this in the SQL Editor specifically if not using migrations tool
-- alter publication supabase_realtime add table conversations, messages;