'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';
import {
  Conversation,
  FREE_MESSAGE_LIMIT,
  getMessages,
  getOrCreateConversation,
  Message,
  unlockConversation,
} from '@/services/chat.service';
import { getSocket } from '@/services/socket';
import { PaywallModal } from '@/components/PaywallModal';
import { NavBar } from '@/components/NavBar';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams<{ conversationId: string }>();
  const searchParams = useSearchParams();
  const matchId = searchParams.get('matchId');
  const { token, user, hasHydrated } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isVip = user?.subscriptionTier === 'VIP' || user?.subscriptionTier === 'CROSS_BORDER_VIP';
  const isUnlockedByMe = !!(user && conversation?.unlockedBy.includes(user.id));
  const isLocked = !!conversation?.isLockedForFree && !isVip && !isUnlockedByMe;

  async function refreshConversation() {
    if (!matchId) return;
    const conv = await getOrCreateConversation(matchId);
    setConversation(conv);
  }

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace('/login');
      return;
    }

    getMessages(params.conversationId).then(setMessages);
    refreshConversation();

    const socket = getSocket();
    socketRef.current = socket;
    socket.connect();
    socket.emit('joinConversation', { conversationId: params.conversationId });

    socket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      refreshConversation();
    });

    socket.on('exception', (payload: { message?: string | string[] }) => {
      const msg = Array.isArray(payload?.message) ? payload.message[0] : payload?.message;
      setError(msg ?? 'ماقدرناش نصيفطو الرسالة');
      if (msg?.includes('limit') || msg?.includes('Upgrade')) setShowPaywall(true);
    });

    return () => {
      socket.off('newMessage');
      socket.off('exception');
      socket.disconnect();
    };
  }, [token, hasHydrated, params.conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!text.trim()) return;
    if (isLocked) {
      setShowPaywall(true);
      return;
    }
    setError(null);
    socketRef.current?.emit('sendMessage', { conversationId: params.conversationId, text: text.trim() });
    setText('');
  }

  async function handleUnlock() {
    setUnlocking(true);
    try {
      await unlockConversation(params.conversationId);
      await refreshConversation();
      setShowPaywall(false);
    } catch {
      setError('ماعندكش نقط كافية، شحن ولا ترقى لـ VIP');
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <main className="mx-auto flex h-screen w-full max-w-2xl flex-col gap-4 px-4 py-6">
      <NavBar />
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((m) => {
            const mine = m.senderId === user?.id;
            return (
              <div key={m._id} className={`mb-2 flex ${mine ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                    mine ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-900'
                  }`}
                >
                  {m.messageText}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {conversation && (
          <p className="border-t border-emerald-50 px-4 py-1 text-center text-xs text-ink-500">
            {conversation.totalMessagesCount}/{FREE_MESSAGE_LIMIT} رسائل مجانية
          </p>
        )}

        {error && <p className="px-4 text-center text-xs text-red-500">{error}</p>}

        {isLocked ? (
          <div className="flex items-center justify-between gap-2 border-t border-emerald-50 p-3">
            <span className="text-sm text-ink-500">وصلتي لحد الرسائل المجانية</span>
            <button
              onClick={() => setShowPaywall(true)}
              className="rounded-xl bg-gold-500 px-4 py-2 text-sm font-semibold text-emerald-900"
            >
              افتح الشات
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 border-t border-emerald-50 p-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="كتب رسالتك..."
              className="flex-1 rounded-xl border border-emerald-100 px-4 py-2 text-sm outline-none focus:border-emerald-400"
            />
            <button
              onClick={handleSend}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              صيفط
            </button>
          </div>
        )}
      </div>

      {showPaywall && (
        <PaywallModal
          loading={unlocking}
          onUnlockWithCoins={handleUnlock}
          onUpgradeVip={() => setError('باقة VIP قريباً 🚀')}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </main>
  );
}
