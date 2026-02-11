"use client";
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from "@/components/layout/Header";
import { useMarketRequest } from "@/hooks/useMarket";
import { useOffers } from "@/hooks/useOffers";
import ProposalModal from "@/components/market/ProposalModal";
import OfferCard from "@/components/market/OfferCard";
import { useProfile } from "@/hooks/useProfile";
import { startConversation } from "@/hooks/useChat";

export default function RequestDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { request, loading, error, refetch: refetchRequest } = useMarketRequest(id);
    const { profile, loading: profileLoading } = useProfile();

    // Derived state
    const isOwner = profile && request && profile.id === request.user_id;
    const isGuest = !profile && !profileLoading;
    const isVendor = profile?.role === 'vendor';

    // Fetch offers only if owner (or maybe vendor viewing own offer? handled by RLS)
    const { offers, loading: offersLoading, updateOfferStatus, refetch: refetchOffers } = useOffers(id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleAcceptOffer = async (offerId: string) => {
        if (!confirm("هل أنت متأكد من قبول هذا العرض؟ سيتم فتح قناة تواصل مع مقدم الخدمة.")) return;

        setActionLoading(offerId);
        try {
            // 1. Update offer status
            await updateOfferStatus(offerId, 'accepted');

            // 2. Start conversation (or enable it)
            const offer = offers.find(o => o.id === offerId);
            if (offer && request) {
                await startConversation(request.id, offer.id, offer.vendor_id, request.user_id);
            }

            alert("تم قبول العرض بنجاح! يمكنك الآن التواصل مع مقدم الخدمة.");
            refetchOffers();
            refetchRequest(); // To update status if needed

            // Optional: redirect to chat?
            // router.push('/messages');
        } catch (error: any) {
            console.error(error);
            alert("حدث خطأ: " + error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectOffer = async (offerId: string) => {
        if (!confirm("هل أنت متأكد من رفض العرض؟")) return;
        setActionLoading(offerId);
        try {
            await updateOfferStatus(offerId, 'rejected');
            refetchOffers();
        } catch (error: any) {
            console.error(error);
            alert("حدث خطأ: " + error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleStartChat = async (offerId: string, vendorId: string) => {
        if (!profile || !request) return;
        setActionLoading(offerId);
        try {
            const convId = await startConversation(request.id, offerId, vendorId, request.user_id);
            router.push(`/messages?conversation_id=${convId}`);
        } catch (error) {
            console.error(error);
            alert("حدث خطأ أثناء بدء المحادثة");
        } finally {
            setActionLoading(null);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="inline-block w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-red-500 mb-4 font-bold text-lg">{error || "الطلب غير موجود"}</p>
                <button
                    onClick={() => router.push('/market')}
                    className="text-[var(--primary)] hover:underline font-bold"
                >
                    العودة للسوق
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            <div className="pt-28 container mx-auto px-4 pb-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <button onClick={() => router.push('/market')} className="hover:text-[var(--primary)] transition-colors">سوق المناسبات</button>
                    <span>/</span>
                    <span className="text-gray-800 font-bold">تفاصيل الطلب</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Request Info */}
                        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{request.event_type}</h1>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <span>تم النشر: {formatDate(request.created_at)}</span>
                                        <span>•</span>
                                        <span>بواسطة {request.profiles?.full_name || 'مستخدم'}</span>
                                    </div>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${request.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {request.status === 'open' ? 'مفتوح للتقديم' : request.status}
                                </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl">📅</span>
                                    <div>
                                        <span className="block text-xs text-gray-400 font-bold mb-1">التاريخ</span>
                                        <span className="font-bold text-gray-800">{formatDate(request.event_date)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl">📍</span>
                                    <div>
                                        <span className="block text-xs text-gray-400 font-bold mb-1">المدينة</span>
                                        <span className="font-bold text-gray-800">{request.city}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl">💰</span>
                                    <div>
                                        <span className="block text-xs text-gray-400 font-bold mb-1">الميزانية المتوقعة</span>
                                        <span className="font-bold text-[var(--primary)] text-lg">
                                            {request.budget_min} - {request.budget_max} ر.س
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">تفاصيل المناسبة</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                        {request.description || "لا يوجد وصف إضافي."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Offers Section (Owner Only) */}
                        {isOwner && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    العروض المقدمة
                                    <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{offers.length}</span>
                                </h3>

                                {offersLoading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[var(--primary)] rounded-full animate-spin"></div>
                                    </div>
                                ) : offers.length === 0 ? (
                                    <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-300">
                                        <div className="text-4xl mb-3">📭</div>
                                        <p className="text-gray-500 font-medium">لم تصلك أي عروض حتى الآن</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {offers.map((offer) => (
                                            <div key={offer.id} className="relative">
                                                <OfferCard
                                                    offer={offer}
                                                    isCustomer={true}
                                                    onAccept={handleAcceptOffer}
                                                    onReject={handleRejectOffer}
                                                />
                                                {/* Chat Button (Only if accepted) */}
                                                {offer.status === 'accepted' && (
                                                    <div className="absolute top-6 left-6">
                                                        <button
                                                            onClick={() => handleStartChat(offer.id, offer.vendor_id)}
                                                            disabled={actionLoading === offer.id}
                                                            className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2"
                                                        >
                                                            <span>💬</span>
                                                            <span>مراسلة المزود</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Action (Non-Owner Only) */}
                    {!isOwner && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-28 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">تقديم عرض</h3>
                                <p className="text-gray-500 mb-6 text-sm">
                                    هل يمكنك تنفيذ هذا الطلب؟ قدم عرضك الآن وابدأ بتحقيق الأرباح.
                                </p>

                                {isGuest ? (
                                    <button
                                        onClick={() => router.push('/auth/login?role=vendor')}
                                        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                                    >
                                        <span>تسجيل الدخول لتقديم عرض</span>
                                    </button>
                                ) : isVendor ? (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="w-full bg-gray-900 hover:bg-[var(--primary)] text-white py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                                    >
                                        <span>تقديم عرض سعر</span>
                                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                                    </button>
                                ) : (
                                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm font-bold text-center">
                                        حسابك مسجل كعميل. يجب عليك التسجيل كمقدم خدمة لتقديم العروض.
                                    </div>
                                )}

                                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                    <p className="text-xs text-gray-400 mb-2">
                                        جميع التعاملات المالية محمية عبر المنصة
                                    </p>
                                    <div className="flex justify-center gap-4 text-2xl opacity-50">
                                        <span>🔒</span>
                                        <span>🛡️</span>
                                        <span>💳</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {request && (
                <ProposalModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    request={request}
                    onSuccess={() => {
                        alert("تم إرسال عرضك بنجاح! سيتم إشعار العميل.");
                        // Force refresh offers if vendor is viewing (feature not fully impl yet for vendor view of own offers on this page, but good for future)
                        refetchOffers();
                    }}
                />
            )}
        </div>
    );
}
