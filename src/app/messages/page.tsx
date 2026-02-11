"use client";
import { useState, useEffect, useRef } from 'react';
import Header from "@/components/layout/Header";
import { useConversations, useMessages, ChatConversation } from "@/hooks/useChat";
import { useSearchParams } from 'next/navigation';

export default function MessagesPage() {
    const { conversations, loading: loadingConvs, userId } = useConversations();
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const searchParams = useSearchParams();

    // Select conversation from URL if present
    useEffect(() => {
        const convId = searchParams.get('conversation_id');
        if (convId) setSelectedConvId(convId);
    }, [searchParams]);

    // If no selection and convs loaded, select first? Maybe no.

    const selectedConversation = conversations.find(c => c.id === selectedConvId);

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-1 pt-20 container mx-auto px-4 pb-4 overflow-hidden">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 h-[calc(100vh-120px)] flex overflow-hidden">

                    {/* Sidebar */}
                    <div className={`${selectedConvId ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-l border-gray-100`}>
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">الرسائل</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loadingConvs ? (
                                <div className="p-4 text-center text-gray-400">جاري التحميل...</div>
                            ) : conversations.length === 0 ? (
                                <div className="p-4 text-center text-gray-400">لا توجد محادثات</div>
                            ) : (
                                conversations.map(conv => {
                                    const otherUser = userId === conv.vendor_id ? conv.customer : conv.vendor;
                                    const isActive = conv.id === selectedConvId;
                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => setSelectedConvId(conv.id)}
                                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${isActive ? 'bg-[var(--cream)]/30 border-r-4 border-[var(--primary)]' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                    {otherUser?.avatar_url ? (
                                                        <img src={otherUser.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                                            {otherUser?.full_name?.[0] || '?'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-gray-800 truncate">{otherUser?.full_name || 'مستخدم'}</h4>
                                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                                            {conv.last_message_time ? new Date(conv.last_message_time).toLocaleDateString() : ''}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 truncate">{conv.last_message || 'لا توجد رسائل بعد'}</p>
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-[10px] rounded text-gray-500">
                                                        {conv.request?.event_type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`${!selectedConvId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[url('/bg-pattern.png')] bg-gray-50/50`}>
                        {selectedConvId && selectedConversation ? (
                            <ChatWindow conversation={selectedConversation} currentUserId={userId} onBack={() => setSelectedConvId(null)} />
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">💬</div>
                                    <p>اختر محادثة للبدء</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

function ChatWindow({ conversation, currentUserId, onBack }: { conversation: ChatConversation, currentUserId: string | null, onBack: () => void }) {
    const { messages, loading, sendMessage } = useMessages(conversation.id);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const otherUser = currentUserId === conversation.vendor_id ? conversation.customer : conversation.vendor;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUserId) return;

        try {
            await sendMessage(newMessage, currentUserId);
            setNewMessage('');
        } catch (err) {
            console.error(err);
            alert('فشل إرسال الرسالة');
        }
    };

    return (
        <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                        <span className="text-xl">→</span>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        {/* Avatar */}
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold bg-[var(--cream)]">
                            {otherUser?.full_name?.[0] || '?'}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">{otherUser?.full_name}</h3>
                        <span className="text-xs text-[var(--primary)] font-medium">حول: {conversation.request?.event_type}</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${isMe
                                    ? 'bg-[var(--primary)] text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-[var(--primary)] text-white px-6 rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        إرسال
                    </button>
                </form>
            </div>
        </>
    );
}
