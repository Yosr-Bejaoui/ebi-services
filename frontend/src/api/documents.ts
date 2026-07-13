import { get, del } from './client';
import { uploadFile } from './client';

export interface ApiDocument {
  _id: string;
  client: string | { _id: string; fullname: string };
  demande?: string | { _id: string; besoin: string };
  nom_fichier: string;
  lien: string;
  uploaded_by: string | { _id: string; fullname: string };
  origine: string;
  taille?: number;
  type_mime?: string;
  createdAt: string;
}

export async function apiGetDocuments() {
  return get<ApiDocument[]>('/documents');
}

export async function apiGetDocumentsByClient(clientId: string) {
  return get<ApiDocument[]>(`/documents/client/${clientId}`);
}

export async function apiUploadDocument(
  demandeId: string,
  file: File,
): Promise<any> {
  const formData = new FormData();
  formData.append('document', file);
  return uploadFile(`/client/demandes/${demandeId}/documents`, formData);
}

export async function apiDeleteDocument(id: string) {
  return del<{ message: string }>(`/documents/${id}`);
}
