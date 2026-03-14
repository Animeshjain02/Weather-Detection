import { io } from 'socket.io-client';

const URL = import.meta.env.MODE === 'production' 
  ? (import.meta.env.VITE_BACKEND_URL || window.location.origin)
  : 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
});
