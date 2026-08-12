import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
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
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';

export default function ChatScreen() {
  const router = useRouter();
  const { conversationId, matchId } = useLocalSearchParams<{ conversationId: string; matchId?: string }>();
  const { token, user } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const isVip = user?.subscriptionTier === 'VIP' || user?.subscriptionTier === 'CROSS_BORDER_VIP';
  const isUnlockedByMe = !!(user && conversation?.unlockedBy.includes(user.id));
  const isLocked = !!conversation?.isLockedForFree && !isVip && !isUnlockedByMe;

  async function refreshConversation() {
    if (!matchId) return;
    const conv = await getOrCreateConversation(matchId);
    setConversation(conv);
  }

  useEffect(() => {
    if (!token) {
      router.replace('/(auth)/login');
      return;
    }

    getMessages(conversationId).then(setMessages);
    refreshConversation();

    const socket = getSocket();
    socketRef.current = socket;
    socket.connect();
    socket.emit('joinConversation', { conversationId });

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
  }, [token, conversationId]);

  function handleSend() {
    if (!text.trim()) return;
    if (isLocked) {
      setShowPaywall(true);
      return;
    }
    setError(null);
    socketRef.current?.emit('sendMessage', { conversationId, text: text.trim() });
    setText('');
  }

  async function handleUnlock() {
    setUnlocking(true);
    try {
      await unlockConversation(conversationId);
      await refreshConversation();
      setShowPaywall(false);
    } catch {
      setError('ماعندكش نقط كافية، شحن ولا ترقى لـ VIP');
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        style={styles.flex}
        contentContainerStyle={{ padding: 16 }}
        data={messages}
        keyExtractor={(m) => m._id}
        renderItem={({ item }) => {
          const mine = item.senderId === user?.id;
          return (
            <View style={[styles.bubbleRow, { justifyContent: mine ? 'flex-end' : 'flex-start' }]}>
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={mine ? styles.bubbleTextMine : styles.bubbleTextTheirs}>{item.messageText}</Text>
              </View>
            </View>
          );
        }}
      />

      {conversation && (
        <Text style={styles.counter}>
          {conversation.totalMessagesCount}/{FREE_MESSAGE_LIMIT} رسائل مجانية
        </Text>
      )}
      {error && <Text style={styles.error}>{error}</Text>}

      {isLocked ? (
        <View style={styles.lockedRow}>
          <Text style={styles.lockedText}>وصلتي لحد الرسائل المجانية</Text>
          <Button variant="gold" onPress={() => setShowPaywall(true)}>
            افتح الشات
          </Button>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="كتب رسالتك..."
            placeholderTextColor={colors.ink500}
            style={styles.input}
          />
          <Button onPress={handleSend}>صيفط</Button>
        </View>
      )}

      <PaywallModal
        visible={showPaywall}
        loading={unlocking}
        onUnlockWithCoins={handleUnlock}
        onUpgradeVip={() => setError('باقة VIP قريباً 🚀')}
        onClose={() => setShowPaywall(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  bubbleRow: { flexDirection: 'row', marginBottom: 8 },
  bubble: { maxWidth: '75%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8 },
  bubbleMine: { backgroundColor: colors.emerald600 },
  bubbleTheirs: { backgroundColor: colors.emerald50 },
  bubbleTextMine: { color: colors.white, fontSize: 14 },
  bubbleTextTheirs: { color: colors.emerald900, fontSize: 14 },
  counter: { fontSize: 11, color: colors.ink500, textAlign: 'center', paddingVertical: 4 },
  error: { fontSize: 12, color: colors.red500, textAlign: 'center' },
  inputRow: { flexDirection: 'row-reverse', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.emerald100 },
  input: { flex: 1, borderWidth: 1, borderColor: colors.emerald100, borderRadius: 14, paddingHorizontal: 14, backgroundColor: colors.white, textAlign: 'right', color: colors.ink700 },
  lockedRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: colors.emerald100 },
  lockedText: { fontSize: 13, color: colors.ink500 },
});
