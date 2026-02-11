import { Offer } from '@/types/market';

interface OfferCardProps {
    offer: Offer;
    isOwner?: boolean; // If true, show vendor specific details/actions
    isCustomer?: boolean; // If true, show customer specific actions (Accept/Reject)
    onAccept?: (id: string) => void;
    onReject?: (id: string) => void;
}

export default function OfferCard({ offer, isOwner, isCustomer, onAccept, onReject }: OfferCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    {offer.vendor?.verified && (
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            ✓ موثق
                        </span>
                    )}
                    <h4 className="font-bold text-gray-800">
                        {offer.profiles?.full_name || 'مزود خدمة'}
                    </h4>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-[var(--primary)]">
                        {formatCurrency(offer.price)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        {formatDate(offer.created_at)}
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                    {offer.message}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${offer.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        offer.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {offer.status === 'accepted' ? 'مقبول' :
                        offer.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                </div>

                {isCustomer && offer.status === 'pending' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onReject && onReject(offer.id)}
                            className="px-4 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 font-bold transition-all text-sm"
                        >
                            رفض
                        </button>
                        <button
                            onClick={() => onAccept && onAccept(offer.id)}
                            className="px-6 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] font-bold transition-all shadow-md hover:shadow-lg text-sm"
                        >
                            قبول العرض
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
