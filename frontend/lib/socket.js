import Cookies from "js-cookie";
import { io } from "socket.io-client";

let socket = null;

export function connectSocket(opts = {}) {
  if (socket && socket.connected) return socket;
  const token = Cookies.get("token");
  socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080", {
    path: "/socket.io",
    auth: { token },
    transports: ["websocket"],
    ...opts,
  });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  try {
    socket?.disconnect();
  } catch (e) {}
  socket = null;
}
