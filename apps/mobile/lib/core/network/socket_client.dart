import 'package:socket_io_client/socket_io_client.dart' as io;

import '../config.dart';

/// Thin wrapper around a socket.io client connected to the `/chat`
/// namespace, mirroring the previous Expo app's `socket.ts` singleton.
///
/// Usage:
/// ```dart
/// socketClient.connect(token);
/// socketClient.on('message', (data) { ... });
/// socketClient.emit('message:send', {...});
/// socketClient.disconnect();
/// ```
class SocketClient {
  io.Socket? _socket;

  bool get isConnected => _socket?.connected ?? false;

  /// Connects (or reconnects) to the chat namespace, authenticating with
  /// [token].
  void connect(String token) {
    _socket?.dispose();
    final socket = io.io(
      '${AppConfig.socketUrl}/chat',
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .disableAutoConnect()
          .build(),
    );
    _socket = socket;
    socket.connect();
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }

  void emit(String event, [dynamic data]) {
    _socket?.emit(event, data);
  }

  void on(String event, void Function(dynamic data) callback) {
    _socket?.on(event, callback);
  }

  void off(String event) {
    _socket?.off(event);
  }
}

/// Shared singleton instance used across the app.
final socketClient = SocketClient();
