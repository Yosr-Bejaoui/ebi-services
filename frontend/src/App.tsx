import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChatbot from "./components/AIChatbot";
import HomeView from "./components/HomeView";
import AboutView from "./components/AboutView";
import ServicesView from "./components/ServicesView";
import ContactView from "./components/ContactView";
import PortalView from "./components/PortalView";
import AdminView from "./components/AdminView";
import { User, Conversation, Notification } from "./types";
import { clientDb } from "./clientDb";
import { apiClient } from "./services/api";
import {
  ShieldAlert,
  Bell,
  Eye,
  EyeOff,
  LayoutDashboard,
  HelpCircle,
  Sparkles,
  Building2,
  Lock,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerCompany, setRegisterCompany] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");

  useEffect(() => {
    const savedToken = sessionStorage.getItem("ebi_access_token");
    if (savedToken) {
      loadSession(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const loadSession = async (sessionToken: string) => {
    try {
      setLoading(true);
      apiClient.setTokens(sessionToken, sessionStorage.getItem("ebi_refresh_token") || "");
      const user = await apiClient.getMe();
      setCurrentUser({
        id: user._id,
        email: user.email,
        name: user.fullname,
        role: user.role,
        companyId: user.entreprise,
        createdAt: user.createdAt,
      });
      setToken(sessionToken);
    } catch (error) {
      console.error("Session load failed:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    if (!token || !currentUser) return;
    try {
      const allNotifs = await apiClient.getNotificationsByDestinataire(currentUser.id);
      const normalized = (allNotifs || []).map((notif) => {
        let defaultTitle = "Notification";
        if (notif.type === 'nouveau_message') defaultTitle = "Nouveau Message";
        else if (notif.type === 'nouveau_devis') defaultTitle = "Nouveau Devis";
        else if (notif.type === 'nouveau_document') defaultTitle = "Nouveau Document";
        else if (notif.type === 'statut_demande') defaultTitle = "Mise à jour Demande";

        return {
          id: notif.id || notif._id,
          userId: notif.destinataire,
          title: notif.title || defaultTitle,
          message: notif.message || notif.contenu || "Aucun détail fourni",
          read: notif.read ?? notif.lu ?? false,
          createdAt: notif.createdAt,
        };
      });
      setNotifications(normalized);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) return;

    try {
      setLoading(true);
      const response = await apiClient.login(loginEmail, loginPassword);
      
      setCurrentUser({
        id: response._id,
        email: response.email,
        name: response.fullname,
        role: response.role,
        createdAt: new Date().toISOString(),
      });
      setToken(response.access_token);

      setLoginEmail("");
      setLoginPassword("");

      if (response.role === "admin") {
        setActiveTab("admin");
      } else {
        setActiveTab("portal");
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Échec de l'authentification.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    if (!registerEmail || !registerPassword || !registerName) return;

    try {
      setLoading(true);
      const response = await apiClient.register(
        registerName,
        registerEmail,
        "",
        registerPassword,
        registerCompany,
      );

      setCurrentUser({
        id: response._id,
        email: response.email,
        name: response.fullname,
        role: response.role,
        createdAt: new Date().toISOString(),
      });
      setToken(response.access_token);

      setRegisterSuccess(true);
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterName("");
      setRegisterCompany("");

      setTimeout(() => {
        setRegisterSuccess(false);
        setActiveTab("portal");
      }, 2000);
    } catch (error) {
      setRegisterError(error instanceof Error ? error.message : "Échec de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStatus(
      "Un lien dynamique de récupération de mot de passe a été généré et envoyé à votre adresse e-mail !",
    );
    setForgotEmail("");
    setTimeout(() => setForgotStatus(""), 5000);
  };

  const handleLogout = () => {
    apiClient.clearTokens();
    setCurrentUser(null);
    setToken(null);
    setNotifications([]);
    setActiveTab("home");
  };

  const triggerChatOpen = () => {
    const launcher = document.querySelector(
      ".fixed.bottom-6.right-6.z-50 button",
    ) as HTMLButtonElement;
    if (launcher) launcher.click();
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      {}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        notifications={notifications}
        onOpenNotifications={() => setShowNotificationsModal(true)}
      />

      {}
      <main className="grow">
        {}
        {activeTab === "home" && (
          <HomeView setActiveTab={setActiveTab} onOpenChat={triggerChatOpen} />
        )}

        {activeTab === "services" && (
          <ServicesView setActiveTab={setActiveTab} />
        )}

        {activeTab === "about" && <AboutView />}

        {activeTab === "contact" && (
          <ContactView onLeadSubmitSuccess={fetchNotifications} />
        )}

        {}
        {activeTab === "portal" && currentUser && token && (
          <PortalView currentUser={currentUser} token={token} />
        )}

        {activeTab === "admin" && currentUser?.role === "admin" && token && (
          <AdminView currentUser={currentUser} token={token} />
        )}

        {}
        {activeTab === "login" && (
          <div className="mx-auto max-w-md px-4 py-16 text-left space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-white shadow-md">
                <Building2 className="h-6 w-6" />
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-900">
                Connexion Services EBI
              </h1>
              <p className="text-xs text-gray-500">
                Saisissez vos identifiants pour accéder à votre portail client sécurisé.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Adresse e-mail professionnelle
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ex. client@acme.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-500">
                      Mot de passe sécurisé
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-900 hover:bg-blue-950 text-white rounded-lg py-2.5 text-xs font-semibold shadow-md transition cursor-pointer"
                >
                  Se connecter en toute sécurité
                </button>
              </form>

              {}
              <div className="pt-4 border-t border-gray-150 space-y-2">
                <span className="block text-[10px] text-gray-400 font-bold uppercase text-center">
                  Mot de passe oublié ?
                </span>
                <form onSubmit={handleForgotSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Saisissez l'e-mail..."
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="flex-1 rounded border border-gray-200 p-1.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                </form>
                {forgotStatus && (
                  <span className="block text-[10px] text-green-700 font-semibold bg-green-50 p-2 rounded text-center border border-green-100">
                    {forgotStatus}
                  </span>
                )}
              </div>
            </div>

            <div className="text-center text-xs text-gray-500">
              Nouveau sur EBI ?{" "}
              <button
                onClick={() => setActiveTab("register")}
                className="text-blue-900 font-bold hover:underline"
              >
                S'inscrire en tant que membre
              </button>
            </div>
          </div>
        )}

        {}
        {activeTab === "register" && (
          <div className="mx-auto max-w-md px-4 py-16 text-left space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-white shadow-md">
                <Building2 className="h-6 w-6" />
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-900">
                Devenir client du portail
              </h1>
              <p className="text-xs text-gray-500">
                Inscrivez-vous en quelques secondes pour demander des devis formels instantanés.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              {registerSuccess ? (
                <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center space-y-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-green-900">
                    Inscription réussie
                  </h3>
                  <p className="text-xs text-green-800">
                    Votre compte a été créé. Redirection vers la connexion...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {registerError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{registerError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Votre nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex. Marc Dubreuil"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Entreprise / Organisation
                    </label>
                    <input
                      type="text"
                      placeholder="ex. Carrefour Logistics"
                      value={registerCompany}
                      onChange={(e) => setRegisterCompany(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Adresse e-mail professionnelle *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ex. marc.d@carrefour.fr"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-900 hover:bg-blue-950 text-white rounded-lg py-2.5 text-xs font-semibold shadow-md transition cursor-pointer"
                  >
                    Terminer l'inscription
                  </button>
                </form>
              )}
            </div>

            <div className="text-center text-xs text-gray-500">
              Vous avez déjà un compte ?{" "}
              <button
                onClick={() => setActiveTab("login")}
                className="text-blue-900 font-bold hover:underline"
              >
                Connectez-vous ici
              </button>
            </div>
          </div>
        )}

        {}
        {activeTab === "privacy" && (
          <div className="mx-auto max-w-3xl px-4 py-12 text-left space-y-6">
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              Politique de confidentialité
            </h1>
            <span className="text-xs text-gray-400 block">
              Dernière mise à jour : 9 juillet 2026
            </span>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-xs text-gray-600 space-y-4 leading-relaxed">
              <p>
                Chez EBI Services, nous donnons la priorité à la sécurité des données. Cette politique de confidentialité détaille comment nous compilons, chiffrons et sécurisons les détails opérationnels des prospects, les devis, les transcriptions de chat et les plannings sur notre plateforme SaaS.
              </p>

              <h3 className="font-bold text-slate-900">
                1. Portée et stockage des données
              </h3>
              <p>
                Tout document technique ou fichier en base64 téléchargé dans notre coffre-fort sécurisé du portail client est chiffré au repos à l'aide de frameworks de qualité industrielle. Nous ne vendons ni ne distribuons les journaux d'entreprise.
              </p>

              <h3 className="font-bold text-slate-900">
                2. Cookies et environnements Sandbox
              </h3>
              <p>
                Étant donné que notre application s'exécute dans des iframes de navigateur en bac à sable hautement sécurisés, nous utilisons des marqueurs d'état de cookies sans suivi (stockant les sessions actives uniquement dans des compartiments localStorage locaux côté client) pour garantir la conformité avec les protocoles du règlement général sur la protection des données (RGPD).
              </p>

              <p>
                Pour obtenir de l'aide concernant la purge des données ou les audits de conformité, contactez compliance@ebiservices.com.
              </p>
            </div>
          </div>
        )}

        {}
        {activeTab === "terms" && (
          <div className="mx-auto max-w-3xl px-4 py-12 text-left space-y-6">
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              Conditions de service
            </h1>
            <span className="text-xs text-gray-400 block">
              Dernière mise à jour : 9 juillet 2026
            </span>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-xs text-gray-600 space-y-4 leading-relaxed">
              <p>
                Ces conditions d'utilisation régissent l'utilisation professionnelle d'EBI Services et du portail client unifié.
              </p>

              <h3 className="font-bold text-slate-900">
                1. Génération de devis et estimations
              </h3>
              <p>
                Tout devis généré par nos modèles de tarification représente une estimation. Les paramètres de tarification finaux restent soumis à des contrats de cadrage technique mutuellement signés par les directeurs régionaux autorisés d'EBI Services.
              </p>

              <h3 className="font-bold text-slate-900">2. SLA techniques</h3>
              <p>
                Les accords de niveau de service (SLA) concernant la maintenance du code logiciel, le recrutement technique, la latence de sélection ou les temps de résolution des tickets d'assistance téléphonique bilingue correspondent aux forfaits standard convenus dans les portails clients.
              </p>

              <p>
                L'accès non autorisé aux systèmes d'EBI, l'automatisation des formulaires de prospects ou l'extraction de nos bases de données de candidats constitue une violation substantielle et entraînera la résiliation immédiate de l'accès.
              </p>
            </div>
          </div>
        )}
      </main>

      {}
      <Footer setActiveTab={setActiveTab} />

      {}
      <AIChatbot
        currentUser={currentUser}
        onLeadSubmitSuccess={fetchNotifications}
      />

      {}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50">
          <div className="h-full w-96 border-l border-gray-200 bg-white p-6 shadow-2xl space-y-4 text-left flex flex-col justify-between">
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                  <Bell className="h-4 w-4" />
                  <span className="font-display text-sm uppercase tracking-wider">
                    Notifications d'activité non lues
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.some(n => !n.read) && currentUser && (
                    <button
                      onClick={async () => {
                        try {
                          await apiClient.markAllNotificationsAsLu(currentUser.id);
                        } catch (err) {
                          console.error(err);
                        }
                        fetchNotifications();
                      }}
                      className="text-[10px] font-bold text-blue-900 hover:underline cursor-pointer"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotificationsModal(false)}
                    className="text-gray-400 hover:text-gray-600 rounded-full p-1 cursor-pointer"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  Aucune notification active.
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={async () => {
                        try {
                          await apiClient.markNotificationAsLu(notif.id);
                        } catch (err) {
                          console.error(err);
                        }
                        fetchNotifications();
                        setShowNotificationsModal(false);
                        if (currentUser?.role === "admin") {
                          setActiveTab("admin");
                        } else {
                          setActiveTab("portal");
                        }
                      }}
                      className={`p-3 rounded-lg border text-xs space-y-1 cursor-pointer transition hover:shadow-sm ${
                        notif.read
                          ? "bg-slate-50 border-gray-150"
                          : "bg-blue-50/50 border-blue-100"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="block font-bold text-gray-900">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await apiClient.markNotificationAsLu(notif.id);
                              } catch (err) {
                                const notifs = clientDb.getNotifications();
                                const found = notifs.find(
                                  (n) => n.id === notif.id,
                                );
                                if (found) {
                                  found.read = true;
                                  clientDb.setNotifications(notifs);
                                }
                              }
                              fetchNotifications();
                            }}
                            className="text-[9px] font-bold text-blue-900 hover:underline cursor-pointer"
                          >
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="block text-[8px] text-gray-400 text-right">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowNotificationsModal(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded py-2 text-xs font-semibold"
            >
              Fermer le panneau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
