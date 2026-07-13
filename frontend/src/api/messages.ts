import { get, post } from './client';

export interface ApiMessage {
  _id: string;
  client: string | { _id: string; fullname: string };
  expediteur: string | { _id: string; fullname: string; role: string };
  contenu: string;
  lu: boolean;
  createdAt: string;
}

export async function apiGetMessages() {
  return get<ApiMessage[]>('/messages');
}

export async function apiGetMessagesByClient(clientId: string) {
  return get<ApiMessage[]>(`/messages/client/${clientId}`);
}

export async function apiCreateMessage(body: {
  client: string;
  expediteur: string;
  contenu: string;
  client_email?: string;
}) {
  return post<{ message: string; createdMessage: ApiMessage }>('/messages', body);
}
