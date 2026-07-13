import { get, patch } from './client';

export interface ApiNotification {
  _id: string;
  destinataire: string | { _id: string; fullname: string };
  type: string;
  reference_id?: string;
  contenu: string;
  lu: boolean;
  createdAt: string;
}

export async function apiGetNotifications() {
  return get<ApiNotification[]>('/notifications');
}

export async function apiGetNotificationsByUser(userId: string) {
  return get<ApiNotification[]>(`/notifications/destinataire/${userId}`);
}

export async function apiMarkNotificationRead(id: string) {
  return patch<{ message: string; notification: ApiNotification }>(
    `/notifications/${id}/lu`,
  );
}

export async function apiMarkAllNotificationsRead(userId: string) {
  return patch<{ message: string }>(`/notifications/destinataire/${userId}/lu`);
}
