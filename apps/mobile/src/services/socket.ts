import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { useAuthStore } from '@/store/auth.store';

const socketUrl =
  (Constants.expoConfig?.extra?.socketUrl as string | undefined) ?? 'http://localhost:3000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  const token = useAuthStore.getState().token;
  socket = io(`${socketUrl}/chat`, {
    auth: { token },
    autoConnect: false,
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
