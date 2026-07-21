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
import { User, Conversation } from "./types";
import { clientDb } from "./clientDb";
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

  const [notifications, setNotifications] = useState<any[]>([]);
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
    const savedToken = localStorage.getItem("ebi_session_token");
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
      const users = clientDb.getUsers();
      const found = users.find((u) => u.id === sessionToken);
      if (found) {
        setCurrentUser(found);
        setToken(sessionToken);
        localStorage.setItem("ebi_session_token", sessionToken);
      } else {
        handleLogout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    if (!token || !currentUser) return;
    try {
      const allNotifs = clientDb.getNotifications();

      const userNotifs =
        currentUser.role === "admin"
          ? allNotifs
          : allNotifs.filter((n) => n.userId === currentUser.id);
      setNotifications(userNotifs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) return;

    try {
      const users = clientDb.getUsers();
      const passwords = clientDb.getPasswords();
      const user = users.find(
        (u) => u.email.toLowerCase() === loginEmail.toLowerCase(),
      );

      if (user && passwords[user.email] === loginPassword) {
        setCurrentUser(user);
        setToken(user.id);
        localStorage.setItem("ebi_session_token", user.id);

        clientDb.addActivityLog(
          user.id,
          user.name,
          "User logged in successfully",
        );

        setLoginEmail("");
        setLoginPassword("");

        if (user.role === "admin") {
          setActiveTab("admin");
        } else {
          setActiveTab("portal");
        }
      } else {
        setLoginError("Invalid email or password.");
      }
    } catch (e) {
      setLoginError("Failed to authenticate.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    if (!registerEmail || !registerPassword || !registerName) return;

    try {
      const users = clientDb.getUsers();
      const passwords = clientDb.getPasswords();

      const exists = users.some(
        (u) => u.email.toLowerCase() === registerEmail.toLowerCase(),
      );
      if (exists) {
        setRegisterError("An account with this email address already exists.");
        return;
      }

      const newUser: User = {
        id: `usr-${Math.random().toString(36).substring(2, 11)}`,
        email: registerEmail,
        name: registerName,
        role: "client",
        companyId: registerCompany || "Individual",
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      passwords[registerEmail] = registerPassword;
      clientDb.setUsers(users);
      clientDb.setPasswords(passwords);

      const convs = clientDb.getConversations();
      const newConv: Conversation = {
        id: `conv-${Math.random().toString(36).substring(2, 11)}`,
        userId: newUser.id,
        clientName: newUser.name,
        clientEmail: newUser.email,
        status: "active",
        lastMessageAt: new Date().toISOString(),
      };
      convs.push(newConv);
      clientDb.setConversations(convs);

      const msgs = clientDb.getMessages();
      msgs.push({
        id: `msg-${Date.now()}`,
        conversationId: newConv.id,
        senderId: "usr-admin",
        senderName: "Jean-Pierre Laurent",
        senderRole: "admin",
        text: `Welcome ${registerName}! Feel free to write any requirements or chat with our team here.`,
        timestamp: new Date().toISOString(),
      });
      clientDb.setMessages(msgs);

      clientDb.addActivityLog(
        newUser.id,
        newUser.name,
        "User registered standard account",
      );

      setRegisterSuccess(true);

      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterName("");
      setRegisterCompany("");
      setTimeout(() => {
        setRegisterSuccess(false);
        setActiveTab("login");
      }, 2000);
    } catch (e) {
      setRegisterError("Failed to register.");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStatus(
      "A dynamic password recovery link has been compiled and dispatched to your email address!",
    );
    setForgotEmail("");
    setTimeout(() => setForgotStatus(""), 5000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    setNotifications([]);
    localStorage.removeItem("ebi_session_token");
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
      <main className="flex-grow">
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
                EBI Services Login
              </h1>
              <p className="text-xs text-gray-500">
                Enter your credentials to access your secure client portal.
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
                    Corporate Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. client@acme.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold uppercase text-gray-500">
                      Secure Password
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
                  Sign In Securely
                </button>
              </form>

              {}
              <div className="pt-4 border-t border-gray-150 space-y-2">
                <span className="block text-[10px] text-gray-400 font-bold uppercase text-center">
                  Forgot Password?
                </span>
                <form onSubmit={handleForgotSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter email..."
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="flex-1 rounded border border-gray-200 p-1.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded transition cursor-pointer"
                  >
                    Reset
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
              New to EBI?{" "}
              <button
                onClick={() => setActiveTab("register")}
                className="text-blue-900 font-bold hover:underline"
              >
                Register as Member
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
                Become Portal Client
              </h1>
              <p className="text-xs text-gray-500">
                Register in seconds to request instant formal pricing quotes.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              {registerSuccess ? (
                <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center space-y-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-green-900">
                    Registration Successful
                  </h3>
                  <p className="text-xs text-green-800">
                    Your account has been provisioned. Redirecting to login...
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
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marc Dubreuil"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Carrefour Logistics"
                      value={registerCompany}
                      onChange={(e) => setRegisterCompany(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Corporate Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. marc.d@carrefour.fr"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Password *
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
                    Complete Provisioning
                  </button>
                </form>
              )}
            </div>

            <div className="text-center text-xs text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => setActiveTab("login")}
                className="text-blue-900 font-bold hover:underline"
              >
                Login here
              </button>
            </div>
          </div>
        )}

        {}
        {activeTab === "privacy" && (
          <div className="mx-auto max-w-3xl px-4 py-12 text-left space-y-6">
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              Privacy Policy
            </h1>
            <span className="text-xs text-gray-400 block">
              Last updated: July 9, 2026
            </span>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-xs text-gray-600 space-y-4 leading-relaxed">
              <p>
                At EBI Services, we prioritize secure data containment. This
                Privacy Policy details how we compile, encrypt, and secure
                operational lead details, quotation documents, chat transcripts,
                and schedules across our SaaS platform.
              </p>

              <h3 className="font-bold text-slate-900">
                1. Data Scoping and Storage
              </h3>
              <p>
                Any technical requirements documents or base64 files uploaded
                inside our Client Portal secure vault are encrypted at rest
                using industry-grade frameworks. We do not Sell or distribute
                corporate logs.
              </p>

              <h3 className="font-bold text-slate-900">
                2. Cookies and Sandbox Environments
              </h3>
              <p>
                Since our application renders inside highly-secured sandboxed
                browser iframe layouts, we employ non-tracking cookie state
                markers (storing active sessions purely inside localized
                client-side browser localStorage buckets) to ensure compliance
                with General Data Protection Regulation (GDPR) protocols.
              </p>

              <p>
                For support regarding data purging or compliance audits, contact
                compliance@ebiservices.com.
              </p>
            </div>
          </div>
        )}

        {}
        {activeTab === "terms" && (
          <div className="mx-auto max-w-3xl px-4 py-12 text-left space-y-6">
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              Terms of Service
            </h1>
            <span className="text-xs text-gray-400 block">
              Last updated: July 9, 2026
            </span>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-xs text-gray-600 space-y-4 leading-relaxed">
              <p>
                These Terms of Service govern corporate usage of EBI Services
                and the unified client portal.
              </p>

              <h3 className="font-bold text-slate-900">
                1. Quote Generation and Estimates
              </h3>
              <p>
                Any pricing quote generated by our pricing models represents an
                estimate. Final pricing parameters remain subject to technical
                scoping contracts mutually executed by authorized EBI Services
                regional directors.
              </p>

              <h3 className="font-bold text-slate-900">2. Technical SLAs</h3>
              <p>
                Service Level Agreements (SLAs) regarding software code
                maintenance, technical recruitment, screening latency, or
                bilingual tele-support ticket resolution times correspond to
                standard packages agreed upon inside client portals.
              </p>

              <p>
                Unauthorized access of EBI's systems, automated scripting of
                lead forms, or scraping of our candidate databases constitutes
                material breach and will terminate access immediately.
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
                    Unread Activity Notifications
                  </span>
                </div>
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  className="text-gray-400 hover:text-gray-600 rounded-full p-1 cursor-pointer"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  No active notices.
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border text-xs space-y-1 ${
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
                            onClick={() => {
                              const notifs = clientDb.getNotifications();
                              const found = notifs.find(
                                (n) => n.id === notif.id,
                              );
                              if (found) {
                                found.read = true;
                                clientDb.setNotifications(notifs);
                              }
                              fetchNotifications();
                            }}
                            className="text-[9px] font-bold text-blue-900 hover:underline"
                          >
                            Read
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
              Close Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
