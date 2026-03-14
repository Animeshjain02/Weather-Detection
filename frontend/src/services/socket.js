import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' 
  ? undefined 
  : 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
});
