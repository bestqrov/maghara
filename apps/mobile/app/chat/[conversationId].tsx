import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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
import { websiteUrl } from '@/services/website';
import { PaywallModal } from '@/components/PaywallModal';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

export default function ChatScreen() {
  const router = useRouter();
  const { locale, dict, row, textAlign, isRTL } = useAppDict();
  const { conversationId, matchId } = useLocalSearchParams<{
    conversationId: string;
    matchId?: string;
  }>();
  const { token, user } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const isVip =
    user?.subscriptionTier === 'VIP' ||
    user?.subscriptionTier === 'CROSS_BORDER_VIP';
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
      const msg = Array.isArray(payload?.message)
        ? payload.message[0]
        : payload?.message;
      setError(msg ?? dict.chat.errorSendFailed);
      if (msg?.includes('limit') || msg?.includes('Upgrade'))
        setShowPaywall(true);
    });

    return () => {
      socket.off('newMessage');
      socket.off('exception');
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, conversationId]);

  function handleSend() {
    if (!text.trim()) return;
    if (isLocked) {
      setShowPaywall(true);
      return;
    }
    setError(null);
    socketRef.current?.emit('sendMessage', {
      conversationId,
      text: text.trim(),
    });
    setText('');
  }

  async function handleUnlock() {
    setUnlocking(true);
    try {
      await unlockConversation(conversationId);
      await refreshConversation();
      setShowPaywall(false);
    } catch {
      setError(dict.chat.errorUnlockFailed);
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        style={styles.flex}
        contentContainerStyle={{ padding: 16 }}
        data={messages}
        keyExtractor={(m) => m._id}
        renderItem={({ item }) => {
          const mine = item.senderId === user?.id;
          // "Mine" bubbles align to the trailing edge of the current text direction.
          const trailing = isRTL ? 'flex-start' : 'flex-end';
          const leading = isRTL ? 'flex-end' : 'flex-start';
          return (
            <View
              style={[
                styles.bubbleRow,
                { justifyContent: mine ? trailing : leading },
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  mine ? styles.bubbleMine : styles.bubbleTheirs,
                ]}
              >
                <Text
                  style={mine ? styles.bubbleTextMine : styles.bubbleTextTheirs}
                >
                  {item.messageText}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {conversation && (
        <Text style={styles.counter}>
          {dict.chat.freeMessages(
            conversation.totalMessagesCount,
            FREE_MESSAGE_LIMIT,
          )}
        </Text>
      )}
      {error && <Text style={styles.error}>{error}</Text>}

      {isLocked ? (
        <View style={[styles.lockedRow, { flexDirection: row }]}>
          <Text style={styles.lockedText}>{dict.chat.limitReached}</Text>
          <Button variant="gold" onPress={() => setShowPaywall(true)}>
            {dict.chat.unlockChat}
          </Button>
        </View>
      ) : (
        <View style={[styles.inputRow, { flexDirection: row }]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={dict.chat.placeholder}
            placeholderTextColor={colors.ink500}
            style={[styles.input, { textAlign }]}
          />
          <Button onPress={handleSend}>{dict.chat.send}</Button>
        </View>
      )}

      <PaywallModal
        visible={showPaywall}
        loading={unlocking}
        onUnlockWithCoins={handleUnlock}
        onUpgradeVip={() => Linking.openURL(websiteUrl(locale, '/store'))}
        onClose={() => setShowPaywall(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  bubbleRow: { flexDirection: 'row', marginBottom: 8 },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bubbleMine: { backgroundColor: colors.emerald600 },
  bubbleTheirs: { backgroundColor: colors.emerald50 },
  bubbleTextMine: { color: colors.white, fontSize: 14 },
  bubbleTextTheirs: { color: colors.emerald900, fontSize: 14 },
  counter: {
    fontSize: 11,
    color: colors.ink500,
    textAlign: 'center',
    paddingVertical: 4,
  },
  error: { fontSize: 12, color: colors.red500, textAlign: 'center' },
  inputRow: {
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.emerald100,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.emerald100,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
    color: colors.ink700,
  },
  lockedRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.emerald100,
  },
  lockedText: { fontSize: 13, color: colors.ink500 },
});
