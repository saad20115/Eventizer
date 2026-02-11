import Link from 'next/link';
import { Request } from '@/types/market';

interface RequestCardProps {
    request: Request;
}

export default function RequestCard({ request }: RequestCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(amount);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group relative">
            <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${request.status === 'open' ? 'bg-green-100 text-green-700' :
                        request.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {request.status === 'open' ? 'مفتوح' : request.status}
                </span>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white flex items-center justify-center text-xl font-bold">
                        {request.event_type.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                            {request.event_type}
                        </h3>
                        <span className="text-gray-400 text-sm block">{formatDate(request.created_at)}</span>
                    </div>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-2 min-h-[3rem]">
                    {request.description || 'لا يوجد وصف متاح'}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="p-1.5 bg-gray-50 rounded-lg">📍</span>
                        <span className="truncate">{request.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="p-1.5 bg-gray-50 rounded-lg">📅</span>
                        <span>{formatDate(request.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm col-span-2">
                        <span className="p-1.5 bg-gray-50 rounded-lg">💰</span>
                        <span className="font-medium text-[var(--primary)]">
                            {formatCurrency(request.budget_min)} - {formatCurrency(request.budget_max)}
                        </span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {request.offers_count || 0} عروض مقدمة
                    </div>
                    <Link
                        href={`/market/${request.id}`}
                        className="bg-gray-900 hover:bg-[var(--primary)] text-white px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        التفاصيل
                    </Link>
                </div>
            </div>
        </div>
    );
}
