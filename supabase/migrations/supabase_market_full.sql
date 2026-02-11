-- Events Market Feature - Comprehensive Schema
-- Run this script in the Supabase SQL Editor
-- 0. Profiles Table (Root Dependency)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    updated_at timestamp with time zone,
    username text unique,
    full_name text,
    avatar_url text,
    website text,
    role text check (role in ('customer', 'vendor', 'admin')) default 'customer',
    phone text,
    constraint username_length check (char_length(username) >= 3)
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR
INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR
UPDATE USING (auth.uid() = id);
END $$;
-- Trigger to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN
INSERT INTO public.profiles (id, full_name, role, phone)
VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'role',
        new.raw_user_meta_data->>'phone'
    );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Drop trigger first to avoid error if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- 1. Vendors Table
-- Extends the profiles table with vendor-specific information
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    business_name TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_jobs INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN DROP POLICY IF EXISTS "Public can view verified vendors" ON public.vendors;
CREATE POLICY "Public can view verified vendors" ON public.vendors FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Vendors can update own profile" ON public.vendors;
CREATE POLICY "Vendors can update own profile" ON public.vendors FOR
UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Vendors can insert own profile" ON public.vendors;
CREATE POLICY "Vendors can insert own profile" ON public.vendors FOR
INSERT WITH CHECK (auth.uid() = id);
END $$;
-- 2. Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    event_type TEXT NOT NULL,
    event_date DATE NOT NULL,
    city TEXT NOT NULL,
    guest_count INTEGER,
    budget_range TEXT,
    service_categories TEXT [],
    description TEXT,
    status TEXT DEFAULT 'open' CHECK (
        status IN (
            'open',
            'reviewing',
            'closed',
            'completed',
            'cancelled'
        )
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
-- Add new columns if they don't exist (for migration)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'requests'
        AND column_name = 'budget_min'
) THEN
ALTER TABLE public.requests
ADD COLUMN budget_min DECIMAL(12, 2);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'requests'
        AND column_name = 'budget_max'
) THEN
ALTER TABLE public.requests
ADD COLUMN budget_max DECIMAL(12, 2);
END IF;
-- Ensure event_date exists
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'requests'
        AND column_name = 'event_date'
) THEN
ALTER TABLE public.requests
ADD COLUMN event_date DATE;
END IF;
-- Ensure description exists
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'requests'
        AND column_name = 'description'
) THEN
ALTER TABLE public.requests
ADD COLUMN description TEXT;
END IF;
END $$;
-- Policies for Requests
DO $$ BEGIN DROP POLICY IF EXISTS "Users can view own requests" ON public.requests;
CREATE POLICY "Users can view own requests" ON public.requests FOR
SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own requests" ON public.requests;
CREATE POLICY "Users can insert own requests" ON public.requests FOR
INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can view open requests" ON public.requests;
CREATE POLICY "Anyone can view open requests" ON public.requests FOR
SELECT USING (status = 'open');
END $$;
-- 3. Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES public.requests(id) NOT NULL,
    vendor_id UUID REFERENCES public.profiles(id) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'accepted', 'rejected', 'withdrawn')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
-- Add new columns
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'offers'
        AND column_name = 'accepted_at'
) THEN
ALTER TABLE public.offers
ADD COLUMN accepted_at TIMESTAMP WITH TIME ZONE;
END IF;
END $$;
-- Policies for Offers
DO $$ BEGIN DROP POLICY IF EXISTS "Vendors can view own offers" ON public.offers;
CREATE POLICY "Vendors can view own offers" ON public.offers FOR
SELECT USING (auth.uid() = vendor_id);
DROP POLICY IF EXISTS "Customers can view offers for their requests" ON public.offers;
CREATE POLICY "Customers can view offers for their requests" ON public.offers FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.requests
            WHERE requests.id = offers.request_id
                AND requests.user_id = auth.uid()
        )
    );
DROP POLICY IF EXISTS "Vendors can create offers" ON public.offers;
CREATE POLICY "Vendors can create offers" ON public.offers FOR
INSERT WITH CHECK (auth.uid() = vendor_id);
DROP POLICY IF EXISTS "Vendors can update own offers" ON public.offers;
CREATE POLICY "Vendors can update own offers" ON public.offers FOR
UPDATE USING (auth.uid() = vendor_id);
DROP POLICY IF EXISTS "Customers can update offers (accept/reject)" ON public.offers;
CREATE POLICY "Customers can update offers (accept/reject)" ON public.offers FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.requests
            WHERE requests.id = offers.request_id
                AND requests.user_id = auth.uid()
        )
    );
END $$;
-- 4. Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES public.requests(id) NOT NULL,
    vendor_id UUID REFERENCES public.profiles(id) NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(request_id, vendor_id)
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
-- Add new columns
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'conversations'
        AND column_name = 'offer_id'
) THEN
ALTER TABLE public.conversations
ADD COLUMN offer_id UUID REFERENCES public.offers(id);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'conversations'
        AND column_name = 'last_message_at'
) THEN
ALTER TABLE public.conversations
ADD COLUMN last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
END IF;
END $$;
-- Policies for Conversations
DO $$ BEGIN DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations" ON public.conversations FOR
SELECT USING (
        auth.uid() = vendor_id
        OR auth.uid() = customer_id
    );
DROP POLICY IF EXISTS "Users can insert conversations" ON public.conversations;
CREATE POLICY "Users can insert conversations" ON public.conversations FOR
INSERT WITH CHECK (
        auth.uid() = vendor_id
        OR auth.uid() = customer_id
    );
END $$;
-- 5. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- Policies for Messages
DO $$ BEGIN DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
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
DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON public.messages;
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
END $$;
-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES public.requests(id) NOT NULL,
    vendor_id UUID REFERENCES public.vendors(id) NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    rating INTEGER CHECK (
        rating >= 1
        AND rating <= 5
    ),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(request_id, customer_id)
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
CREATE POLICY "Public can view reviews" ON public.reviews FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Customers can create reviews" ON public.reviews;
CREATE POLICY "Customers can create reviews" ON public.reviews FOR
INSERT WITH CHECK (auth.uid() = customer_id);
END $$;
-- 7. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES public.requests(id) NOT NULL,
    offer_id UUID REFERENCES public.offers(id) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    commission_amount DECIMAL(12, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'paid', 'refunded', 'released')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.requests
            WHERE requests.id = transactions.request_id
                AND requests.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1
            FROM public.offers
            WHERE offers.id = transactions.offer_id
                AND offers.vendor_id = auth.uid()
        )
    );
END $$;
-- 8. Grant permissions
GRANT ALL ON public.profiles TO authenticated,
    service_role;
GRANT ALL ON public.vendors TO authenticated,
    service_role;
GRANT ALL ON public.reviews TO authenticated,
    service_role;
GRANT ALL ON public.transactions TO authenticated,
    service_role;
GRANT ALL ON public.requests TO authenticated,
    service_role;
GRANT ALL ON public.offers TO authenticated,
    service_role;
GRANT ALL ON public.conversations TO authenticated,
    service_role;
GRANT ALL ON public.messages TO authenticated,
    service_role;
-- 9. Enable Realtime (Optional, usually configured in dashboard, but safe to try)
DO $$ BEGIN EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE conversations, messages';
EXCEPTION
WHEN OTHERS THEN NULL;
-- Ignore if publication doesn't exist or table already added
END $$;