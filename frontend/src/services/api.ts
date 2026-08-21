const API_BASE_URL = 'http://127.0.0.1:5001/api';

export interface ApiError {
  message: string;
  error?: string;
  status?: number;
}

export interface AuthResponse {
  _id: string;
  fullname: string;
  email: string;
  role: 'admin' | 'client' | 'visitor';
  access_token: string;
  refresh_token: string;
}

export interface User {
  _id: string;
  fullname: string;
  email: string;
  telephone: string;
  entreprise?: string;
  role: 'admin' | 'client' | 'visitor';
  createdAt: string;
}

export interface Service {
  _id: string;
  nom: string;
  description: string;
}

export interface DemandeDevis {
  _id: string;
  client: string;
  service: string | Service;
  manager?: string;
  besoin: string;
  statut: 'en_attente' | 'en_cours' | 'devis_envoye' | 'accepte' | 'refuse';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Devis {
  _id: string;
  demande: string | DemandeDevis;
  fichier_pdf: string;
  montant: number;
  statut: 'envoye' | 'telecharge' | 'accepte' | 'refuse';
  date_telechargement?: string;
  createdAt: string;
}

export interface Document {
  _id: string;
  client: string;
  demande: string;
  nom_fichier: string;
  lien: string;
  uploaded_by: string;
  origine: 'client' | 'admin';
  taille: number;
  type_mime: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  client: string;
  expediteur: string;
  contenu: string;
  lu: boolean;
  createdAt: string;
}

export interface Notification {
  _id: string;
  destinataire: string;
  type: string;
  reference_id: string;
  contenu: string;
  lu: boolean;
  createdAt: string;
  id?: string;
  title?: string;
  message?: string;
  read?: boolean;
}

class ApiClient {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    const savedToken = sessionStorage.getItem('ebi_access_token');
    const savedRefreshToken = sessionStorage.getItem('ebi_refresh_token');
    if (savedToken) {
      this.token = savedToken;
      this.refreshToken = savedRefreshToken;
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    sessionStorage.setItem('ebi_access_token', accessToken);
    sessionStorage.setItem('ebi_refresh_token', refreshToken);
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    sessionStorage.removeItem('ebi_access_token');
    sessionStorage.removeItem('ebi_refresh_token');
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        this.clearTokens();
        throw new Error('Unauthorized. Please login again.');
      }

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          message: `HTTP ${response.status}`,
        }));
        throw new Error(error.message || `Request failed: ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  async register(
    fullname: string,
    email: string,
    telephone: string,
    password: string,
    entreprise?: string
  ): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('POST', '/auth/register', {
      fullname,
      email,
      telephone,
      password,
      entreprise,
    });
    this.setTokens(response.access_token, response.refresh_token);
    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('POST', '/auth/login', {
      email,
      password,
    });
    this.setTokens(response.access_token, response.refresh_token);
    return response;
  }

  async getMe(): Promise<User> {
    return this.request<User>('GET', '/auth/me');
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('GET', '/utilisateurs');
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>('GET', `/utilisateurs/${id}`);
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return this.request<User[]>('GET', `/utilisateurs/role/${role}`);
  }

  async createUser(user: Partial<User>): Promise<User> {
    return this.request<User>('POST', '/utilisateurs', user);
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return this.request<User>('PUT', `/utilisateurs/${id}`, user);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('DELETE', `/utilisateurs/${id}`);
  }

  async getDemandesDevis(): Promise<DemandeDevis[]> {
    return this.request<DemandeDevis[]>('GET', '/demandes-devis');
  }

  async getDemandeDevisById(id: string): Promise<DemandeDevis> {
    return this.request<DemandeDevis>('GET', `/demandes-devis/${id}`);
  }

  async getDemandesByClient(clientId: string): Promise<DemandeDevis[]> {
    return this.request<DemandeDevis[]>('GET', `/demandes-devis/client/${clientId}`);
  }

  async createDemandeDevis(demande: Partial<DemandeDevis>): Promise<DemandeDevis> {
    return this.request<DemandeDevis>('POST', '/demandes-devis', demande);
  }

  async updateDemandeDevis(id: string, demande: Partial<DemandeDevis>): Promise<DemandeDevis> {
    return this.request<DemandeDevis>('PUT', `/demandes-devis/${id}`, demande);
  }

  async deleteDemandeDevis(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('DELETE', `/demandes-devis/${id}`);
  }

  async addNote(id: string, note: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('POST', `/demandes-devis/${id}/notes`, { note });
  }

  async getNotes(id: string): Promise<{ notes: string[] }> {
    return this.request<{ notes: string[] }>('GET', `/demandes-devis/${id}/notes`);
  }

  async getDevis(): Promise<Devis[]> {
    return this.request<Devis[]>('GET', '/devis');
  }

  async getDevisById(id: string): Promise<Devis> {
    return this.request<Devis>('GET', `/devis/${id}`);
  }

  async getDevisByDemande(demandeId: string): Promise<Devis[]> {
    return this.request<Devis[]>('GET', `/devis/demande/${demandeId}`);
  }

  async createDevis(devis: Partial<Devis>): Promise<Devis> {
    return this.request<Devis>('POST', '/devis', devis);
  }

  async updateDevis(id: string, devis: Partial<Devis>): Promise<Devis> {
    return this.request<Devis>('PUT', `/devis/${id}`, devis);
  }

  async deleteDevis(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('DELETE', `/devis/${id}`);
  }

  async getDocuments(): Promise<Document[]> {
    return this.request<Document[]>('GET', '/documents');
  }

  async getDocumentById(id: string): Promise<Document> {
    return this.request<Document>('GET', `/documents/${id}`);
  }

  async getDocumentsByClient(clientId: string): Promise<Document[]> {
    return this.request<Document[]>('GET', `/documents/client/${clientId}`);
  }

  async getDocumentsByDemande(demandeId: string): Promise<Document[]> {
    return this.request<Document[]>('GET', `/documents/demande/${demandeId}`);
  }

  async createDocument(doc: Partial<Document>): Promise<Document> {
    return this.request<Document>('POST', '/documents', doc);
  }

  async updateDocument(id: string, doc: Partial<Document>): Promise<Document> {
    return this.request<Document>('PUT', `/documents/${id}`, doc);
  }

  async deleteDocument(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('DELETE', `/documents/${id}`);
  }

  async getMessages(): Promise<Message[]> {
    return this.request<Message[]>('GET', '/messages');
  }

  async getMessageById(id: string): Promise<Message> {
    return this.request<Message>('GET', `/messages/${id}`);
  }

  async getMessagesByClient(clientId: string): Promise<Message[]> {
    return this.request<Message[]>('GET', `/messages/client/${clientId}`);
  }

  async createMessage(message: Partial<Message>): Promise<Message> {
    return this.request<Message>('POST', '/messages', message);
  }

  async deleteMessage(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('DELETE', `/messages/${id}`);
  }

  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('GET', '/notifications');
  }

  async getNotificationById(id: string): Promise<Notification> {
    return this.request<Notification>('GET', `/notifications/${id}`);
  }

  async getNotificationsByDestinataire(destinataireId: string): Promise<Notification[]> {
    return this.request<Notification[]>('GET', `/notifications/destinataire/${destinataireId}`);
  }

  async createNotification(notif: Partial<Notification>): Promise<Notification> {
    return this.request<Notification>('POST', '/notifications', notif);
  }

  async markNotificationAsLu(id: string): Promise<Notification> {
    return this.request<Notification>('PATCH', `/notifications/${id}/lu`);
  }

  async markAllNotificationsAsLu(destinataireId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('PATCH', `/notifications/destinataire/${destinataireId}/lu`);
  }

  async deleteNotification(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('DELETE', `/notifications/${id}`);
  }

  async health(): Promise<{ status: string; database: string; message: string }> {
    return this.request('GET', '/health');
  }
}

export const apiClient = new ApiClient();
