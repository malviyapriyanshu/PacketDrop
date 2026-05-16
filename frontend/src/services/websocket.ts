import { Client } from '@stomp/stompjs';
import type { UploadProgress, UploadResult } from '../types';

type ProgressHandler = (data: UploadProgress) => void;
type CompleteHandler = (data: UploadResult) => void;
type ErrorHandler = (data: { filename: string; message: string }) => void;

let client: Client | null = null;
let progressHandlers: ProgressHandler[] = [];
let completeHandlers: CompleteHandler[] = [];
let errorHandlers: ErrorHandler[] = [];

export function connectWebSocket() {
  if (client?.active) return;

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws`;

  client = new Client({
    brokerURL: wsUrl,
    reconnectDelay: 3000,
    onConnect: () => {
      client?.subscribe('/topic/upload/progress', (msg) => {
        const data = JSON.parse(msg.body);
        progressHandlers.forEach((h) => h(data));
      });
      client?.subscribe('/topic/upload/complete', (msg) => {
        const data = JSON.parse(msg.body);
        completeHandlers.forEach((h) => h(data));
      });
      client?.subscribe('/topic/upload/error', (msg) => {
        const data = JSON.parse(msg.body);
        errorHandlers.forEach((h) => h(data));
      });
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message']);
    },
  });

  client.activate();
}

export function disconnectWebSocket() {
  client?.deactivate();
  client = null;
}

export function onProgress(handler: ProgressHandler) {
  progressHandlers.push(handler);
  return () => { progressHandlers = progressHandlers.filter((h) => h !== handler); };
}

export function onComplete(handler: CompleteHandler) {
  completeHandlers.push(handler);
  return () => { completeHandlers = completeHandlers.filter((h) => h !== handler); };
}

export function onError(handler: ErrorHandler) {
  errorHandlers.push(handler);
  return () => { errorHandlers = errorHandlers.filter((h) => h !== handler); };
}
