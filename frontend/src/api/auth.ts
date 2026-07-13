import { post, get } from './client';

export interface ApiAuthResponse {
  _id: string;
  fullname: string;
  email: string;
  role: string;
  access_token: string;
  refresh_token: string;
}

export interface ApiUser {
  _id: string;
  fullname: string;
  email: string;
  telephone?: number;
  role: string;
  entreprise?: string;
  createdAt?: string;
}

export async function apiLogin(email: string, password: string) {
  const data = await post<ApiAuthResponse>('/auth/login', { email, password });
  return data;
}

export async function apiRegister(
  fullname: string,
  email: string,
  telephone: string,
  password: string,
  entreprise?: string,
) {
  const data = await post<ApiAuthResponse>('/auth/register', {
    fullname,
    email,
    telephone,
    password,
    entreprise,
  });
  return data;
}

export async function apiGetMe() {
  const data = await get<ApiUser>('/auth/me');
  return data;
}

export async function apiGetUsers() {
  const data = await get<ApiUser[]>('/utilisateurs');
  return data;
}

export async function apiGetUsersByRole(role: string) {
  const data = await get<ApiUser[]>(`/utilisateurs/role/${role}`);
  return data;
}
