import { io } from 'socket.io-client';
import { getAuthData } from './utils/secureStorage';
const { token } = getAuthData();

const getBaseURL = () => {
  const { protocol, hostname, port } = window.location;
  const basePort = port ? `:${port}` : '';
  return `${protocol}//${hostname}${basePort}`;
};

const socket = io(getBaseURL(), {
  transports: ['websocket'],
  upgrade: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  extraHeaders: {
    Authorization: `Bearer ${token}`
  }
});


socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('connect', () => {
  console.log('Socket connected successfully');
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected. Reason:', reason);
});

export default socket;
