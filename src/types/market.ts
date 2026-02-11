export type RequestStatus = 'open' | 'reviewing' | 'closed' | 'completed' | 'cancelled';
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type ConversationStatus = 'active' | 'archived';
export type TransactionStatus = 'pending' | 'paid' | 'refunded' | 'released';

export interface Vendor {
    id: string; // matches profile id
    business_name: string;
    verified: boolean;
    rating: number;
    total_jobs: number;
    created_at: string;
}

export interface Request {
    id: string;
    user_id: string;
    event_type: string;
    event_date: string; // ISO date string
    city: string;
    budget_min: number;
    budget_max: number;
    description: string;
    status: RequestStatus;
    created_at: string;
    // Optional joined fields
    offers_count?: number;
    profiles?: {
        full_name: string;
        avatar_url: string;
    };
}

export interface Offer {
    id: string;
    request_id: string;
    vendor_id: string;
    price: number;
    message?: string; // Hidden from public
    status: OfferStatus;
    created_at: string;
    accepted_at?: string;
    // Optional joined fields
    vendor?: Vendor; // Aliased in query
    profiles?: { // vendor profile details
        full_name: string;
        avatar_url: string;
    };
}

export interface Conversation {
    id: string;
    request_id: string;
    offer_id: string;
    vendor_id: string;
    customer_id: string;
    status: ConversationStatus;
    last_message_at: string;
    created_at: string;
    // Optional joined fields
    other_party?: {
        id: string;
        full_name: string;
        avatar_url: string;
    };
    request?: {
        event_type: string;
    };
    vendor?: {
        full_name: string;
        avatar_url: string;
    };
    customer?: {
        full_name: string;
        avatar_url: string;
    };
    messages?: {
        content: string;
        created_at: string;
    }[];
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export interface Review {
    id: string;
    request_id: string;
    vendor_id: string;
    customer_id: string;
    rating: number; // 1-5
    comment?: string;
    created_at: string;
}

export interface Transaction {
    id: string;
    request_id: string;
    offer_id: string;
    amount: number;
    commission_amount: number;
    status: TransactionStatus;
    created_at: string;
}
