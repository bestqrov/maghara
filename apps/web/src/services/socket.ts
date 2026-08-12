import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  const token = useAuthStore.getState().token;
  socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000'}/chat`, {
    auth: { token },
    autoConnect: false,
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
