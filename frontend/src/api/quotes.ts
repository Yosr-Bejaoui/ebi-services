import { get, post, put } from './client';

export interface ApiDemandeDevis {
  _id: string;
  client: string | { _id: string; fullname: string; email: string };
  service: string | { _id: string; nom: string; description?: string };
  manager?: string | { _id: string; fullname: string };
  besoin: string;
  statut: string;
  notes?: any[];
  createdAt: string;
}

export interface ApiDevis {
  _id: string;
  demande: string | { _id: string; besoin: string };
  fichier_pdf?: string;
  montant: number;
  statut: string;
  createdAt: string;
}

export async function apiGetDemandes() {
  return get<ApiDemandeDevis[]>('/demandes');
}

export async function apiGetDemandesByClient(clientId: string) {
  return get<ApiDemandeDevis[]>(`/demandes/client/${clientId}`);
}

export async function apiCreateDemande(body: {
  client: string;
  service: string;
  besoin: string;
}) {
  return post<{ message: string; demande: ApiDemandeDevis }>(
    '/demandes',
    body,
  );
}

export async function apiUpdateDemande(
  id: string,
  body: Partial<ApiDemandeDevis>,
) {
  return put<{ message: string; demande: ApiDemandeDevis }>(
    `/demandes/${id}`,
    body,
  );
}

export async function apiGetDevis() {
  return get<ApiDevis[]>('/devis');
}

export async function apiGetDevisByDemande(demandeId: string) {
  return get<ApiDevis[]>(`/devis/demande/${demandeId}`);
}

export async function apiCreateDevis(body: {
  demande: string;
  montant: number;
}) {
  return post<{ message: string; devis: ApiDevis }>('/devis', body);
}

export async function apiUpdateDevis(id: string, body: Partial<ApiDevis>) {
  return put<{ message: string; devis: ApiDevis }>(`/devis/${id}`, body);
}
