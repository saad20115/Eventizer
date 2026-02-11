"use client";
import { useState } from 'react';
import { useOffers } from '@/hooks/useOffers';
import { Request } from '@/types/market';
import { supabase } from '@/modules/shared/config/supabase';

interface ProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: Request;
    onSuccess: () => void;
}

export default function ProposalModal({ isOpen, onClose, request, onSuccess }: ProposalModalProps) {
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { submitOffer } = useOffers();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("يجب عليك تسجيل الدخول أولاً");

            // Check if user is vendor... relying on RLS/Backend triggering errors if not allowed
            // Ideally we check profile role here too

            await submitOffer({
                request_id: request.id,
                vendor_id: user.id,
                price: parseFloat(price),
                message: message,
                status: 'pending'
            });

            setPrice('');
            setMessage('');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "حدث خطأ أثناء تقديم العرض");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fadeInUp">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">تقديم عرض سعر</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">السعر المقترح (ر.س)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            min="0"
                            placeholder="0.00"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">رسالة العرض</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={4}
                            placeholder="اكتب تفاصيل عرضك هنا... (سيتم حجبها عن المنافسين)"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all resize-none"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary-dark)] transition-all shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'جاري الإرسال...' : 'إرسال العرض'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
