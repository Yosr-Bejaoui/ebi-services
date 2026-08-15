import React, { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  CalendarDays,
  FileDown,
  MessageSquareCode,
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Trash2,
  Bell,
  ShieldAlert,
  Check,
  HelpCircle,
} from "lucide-react";
import {
  User,
  UserRole,
  QuoteRequest,
  Quote,
  ClientDocument,
  Message,
  Appointment,
} from "../types";
import { clientDb } from "../clientDb";
import { apiClient } from "../services/api";

interface PortalViewProps {
  currentUser: User;
  token: string;
}

export default function PortalView({ currentUser, token }: PortalViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "dashboard" | "quotes" | "appointments" | "chat" | "documents"
  >("dashboard");

  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [isBooking, setIsBooking] = useState(false);
  const [aptTitle, setAptTitle] = useState("");
  const [aptDate, setAptDate] = useState("");
  const [aptSlot, setAptSlot] = useState("09:00 AM - 10:00 AM");
  const [aptTimezone, setAptTimezone] = useState("Europe/Paris");

  const [isRequestingQuote, setIsRequestingQuote] = useState(false);
  const [quoteIndustry, setQuoteIndustry] = useState("Vente au détail et commerce électronique");
  const [quoteType, setQuoteType] = useState("Application SaaS Web");
  const [quoteBudget, setQuoteBudget] = useState("€10,000 - €25,000");
  const [quoteDeadline, setQuoteDeadline] = useState("3 mois");
  const [quoteRequirements, setQuoteRequirements] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    base64: string;
  } | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState("");

  const [chatMessage, setChatMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPortalData();
    const interval = setInterval(fetchPortalData, 10000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchPortalData = async () => {
    try {
      // Fetch from API
      const rReqsRaw = await apiClient.getDemandesByClient(currentUser.id).catch(() => []);
      const mappedReqs: QuoteRequest[] = rReqsRaw.map(r => ({
        id: r._id,
        userId: r.client,
        clientName: currentUser.name,
        company: currentUser.companyId || "Company",
        industry: "N/A",
        projectType: typeof r.service === 'string' ? r.service : (r.service as any)?.nom || "Service",
        budget: "N/A",
        deadline: "N/A",
        requirements: r.besoin,
        status: (r.statut === "en_attente" ? "new" : r.statut === "accepte" ? "accepted" : r.statut === "refuse" ? "rejected" : "waiting") as any,
        createdAt: r.createdAt
      }));
      setQuoteRequests(mappedReqs);

      const rMsgsRaw = await apiClient.getMessagesByClient(currentUser.id).catch(() => []);
      const mappedMsgs: Message[] = rMsgsRaw.map(m => {
        const expediteurId = typeof m.expediteur === 'object' && m.expediteur ? (m.expediteur as any)._id : m.expediteur;
        const isMe = expediteurId === currentUser.id;
        return {
          id: m._id,
          conversationId: "default",
          senderId: expediteurId,
          senderName: isMe ? currentUser.name : "Manager",
          senderRole: (isMe ? "client" : "admin") as UserRole,
          text: m.contenu,
          timestamp: m.createdAt
        };
      });
      setMessages(mappedMsgs);

      // Keep appointments & other unmigrated stuff on clientDb for now
      const rQuotes = clientDb.getQuotes().filter((q) => q.clientName === currentUser.name);
      const rApts = clientDb.getAppointments().filter((a) => a.userId === currentUser.id);
      const rDocs = clientDb.getDocuments().filter((d) => d.userId === currentUser.id);
      const rNotifs = clientDb.getNotifications().filter((n) => n.userId === currentUser.id);
      setQuotes(rQuotes);
      setAppointments(rApts);
      setDocuments(rDocs);
      setNotifications(rNotifs);

    } catch (e) {
      console.error("Portal fetch failed:", e);
    }
  };

  const handleQuoteRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteType || !quoteRequirements) {
      alert("Please fill in all required fields, including the Requirements Spec.");
      return;
    }

    try {
      // Fallback service ID lookup if needed, but the backend accepts strings if not strict ObjectId
      // For now we pass the string, or we should fetch services. But we'll try API first.
      await apiClient.createDemandeDevis({
        client: currentUser.id,
        service: "660c1d1e4f4b1e4a1a7b1c1d", // Hardcoded fallback service ID if backend strict on ObjectId. Ideally we'd map quoteType to actual service._id.
        besoin: `[${quoteType}] ${quoteRequirements}`
      }).catch(async () => {
         // Fallback if backend strict about Service ID, save to clientDb so it doesn't break UI completely
         const reqs = clientDb.getQuoteRequests();
         reqs.push({
           id: `qr-${Date.now()}`,
           userId: currentUser.id,
           clientName: currentUser.name,
           company: currentUser.companyId || "Individual",
           industry: quoteIndustry,
           projectType: quoteType,
           budget: quoteBudget,
           deadline: quoteDeadline,
           requirements: quoteRequirements,
           status: "new",
           createdAt: new Date().toISOString(),
         });
         clientDb.setQuoteRequests(reqs);
      });

      setIsRequestingQuote(false);
      setQuoteRequirements("");
      setUploadedFile(null);
      fetchPortalData();
    } catch (err) {
      console.error(err);
      alert("Failed to submit quote request.");
    }
  };

  const handleAppointmentBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptTitle || !aptDate) return;

    try {
      const apts = clientDb.getAppointments();
      const newApt: Appointment = {
        id: `apt-${Math.random().toString(36).substring(2, 11)}`,
        userId: currentUser.id,
        clientName: currentUser.name,
        clientEmail: currentUser.email,
        title: aptTitle,
        date: aptDate,
        timeSlot: aptSlot,
        timezone: aptTimezone,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      apts.push(newApt);
      clientDb.setAppointments(apts);

      clientDb.addNotification(
        "usr-admin",
        "Consultation Requested",
        `${currentUser.name} requested an appointment: "${aptTitle}" on ${aptDate} at ${aptSlot}.`,
      );
      clientDb.addActivityLog(
        currentUser.id,
        currentUser.name,
        `Requested consultation: "${aptTitle}"`,
      );

      setIsBooking(false);
      setAptTitle("");
      setAptDate("");
      fetchPortalData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuoteAction = (
    quoteId: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      const quotesList = clientDb.getQuotes();
      const quote = quotesList.find((q) => q.id === quoteId);
      if (quote) {
        quote.status = status;
        clientDb.setQuotes(quotesList);

        if (quote.quoteRequestId) {
          const rList = clientDb.getQuoteRequests();
          const qReq = rList.find((r) => r.id === quote.quoteRequestId);
          if (qReq) {
            qReq.status = status;
            clientDb.setQuoteRequests(rList);
          }
        }

        clientDb.addNotification(
          "usr-admin",
          `Quote ${status.toUpperCase()}`,
          `${currentUser.name} has ${status} the proposal of €${quote.amount.toLocaleString()} for "${quote.projectName}".`,
        );
        clientDb.addActivityLog(
          currentUser.id,
          currentUser.name,
          `${status} quotation for "${quote.projectName}"`,
        );
      }
      fetchPortalData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFile = (file: File) => {
    if (!file) return;
    setUploadProgressMsg("Compressing and hashing...");

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const docsList = clientDb.getDocuments();
        const newDoc: ClientDocument = {
          id: `doc-${Math.random().toString(36).substring(2, 11)}`,
          userId: currentUser.id,
          name: file.name,
          type: file.type,
          size:
            file.size > 1024 * 1024
              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
              : `${(file.size / 1024).toFixed(0)} KB`,
          url: "#",
          createdAt: new Date().toISOString(),
        };
        docsList.push(newDoc);
        clientDb.setDocuments(docsList);

        clientDb.addNotification(
          "usr-admin",
          "Secure Document Uploaded",
          `${currentUser.name} uploaded document "${file.name}" into their Portal Vault.`,
        );
        clientDb.addActivityLog(
          currentUser.id,
          currentUser.name,
          `Uploaded document "${file.name}" to Vault`,
        );

        setUploadProgressMsg("Upload Completed!");
        setTimeout(() => setUploadProgressMsg(""), 2000);
        fetchPortalData();
      } catch (err) {
        console.error(err);
        setUploadProgressMsg("Upload failed.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleQuoteAttachmentInput = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFile({
          name: file.name,
          base64: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    try {
      try {
        await apiClient.createMessage({
          client: currentUser.id,
          expediteur: currentUser.id,
          contenu: chatMessage
        });
      } catch (err) {
        console.error("Backend message failed, using local DB");
      }

      // Always update local mock DB so AdminView can see it in real-time
      let convs = clientDb.getConversations();
      let conv = convs.find(c => c.userId === currentUser.id);
      if (!conv) {
         conv = {
           id: `conv-${currentUser.id}`,
           userId: currentUser.id,
           clientName: currentUser.name,
           clientEmail: currentUser.email,
           status: "active",
           summary: chatMessage.substring(0, 30) + "...",
           lastMessageAt: new Date().toISOString()
         };
         clientDb.setConversations([...convs, conv]);
      } else {
         conv.summary = chatMessage.substring(0, 30) + "...";
         conv.lastMessageAt = new Date().toISOString();
         clientDb.setConversations(convs);
      }

      const msgs = clientDb.getMessages();
      msgs.push({
        id: `msg-${Date.now()}`,
        conversationId: conv.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        text: chatMessage,
        timestamp: new Date().toISOString(),
      });
      clientDb.setMessages(msgs);

      clientDb.addNotification(
         "usr-admin",
         "New Client Message",
         `${currentUser.name} sent a new message in the chat.`
      );
      
      clientDb.addActivityLog(
         currentUser.id,
         currentUser.name,
         `Sent a message in the secure chat`
      );

      setChatMessage("");
      fetchPortalData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocument = (id: string) => {
    try {
      const docsList = clientDb.getDocuments();
      const filtered = docsList.filter((d) => d.id !== id);
      clientDb.setDocuments(filtered);

      clientDb.addActivityLog(
        currentUser.id,
        currentUser.name,
        `Deleted document ID ${id} from Vault`,
      );
      fetchPortalData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
            Portail client actif
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Bienvenue, {currentUser.name}
          </h1>
          <p className="text-xs text-gray-500">
            Track and manage your EBI Custom software, HR, and outsourcing
            requests directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsRequestingQuote(true)}
            className="rounded-lg bg-blue-900 hover:bg-blue-950 text-white px-3.5 py-2 text-xs font-semibold shadow flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Demander un devis</span>
          </button>
          <button
            onClick={() => setIsBooking(true)}
            className="rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white px-3.5 py-2 text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Réserver une consultation</span>
          </button>
        </div>
      </div>

      {}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6 text-xs font-bold tracking-wide uppercase">
          {[
            { id: "dashboard", label: "Aperçu" },
            { id: "quotes", label: "Devis & Demandes" },
            { id: "appointments", label: "Consultations" },
            { id: "chat", label: "Chat avec le manager" },
            { id: "documents", label: "Coffre-fort sécurisé" },
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`py-2 border-b-2 cursor-pointer transition-all ${
                activeSubTab === sub.id
                  ? "border-blue-900 text-blue-900 font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </nav>
      </div>

      {}
      {}
      {}
      {activeSubTab === "dashboard" && (
        <div className="space-y-6">
          {}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-1 text-left">
              <span className="text-gray-400 text-[10px] uppercase font-bold">
                Pipelines de demandes totaux
              </span>
              <span className="block text-2xl font-extrabold text-blue-950">
                {quoteRequests.length}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                Exigences enregistrées dans le CRM
              </span>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-1 text-left">
              <span className="text-gray-400 text-[10px] uppercase font-bold">
                Devis émis
              </span>
              <span className="block text-2xl font-extrabold text-blue-950">
                {quotes.length}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                Prêt pour examen
              </span>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-1 text-left">
              <span className="text-gray-400 text-[10px] uppercase font-bold">
                Réunions planifiées
              </span>
              <span className="block text-2xl font-extrabold text-blue-950">
                {
                  appointments.filter(
                    (a) => a.status === "confirmed" || a.status === "pending",
                  ).length
                }
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                Journaux de consultations
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {}
            <div className="md:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-display text-sm font-bold text-slate-950">
                  Mes devis formels
                </h3>
                <button
                  onClick={() => setActiveSubTab("quotes")}
                  className="text-xs text-blue-900 hover:underline"
                >
                  Voir tout
                </button>
              </div>

              {quotes.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Aucun devis généré pour le moment. Soumettez une demande de projet pour commencer.
                </div>
              ) : (
                <div className="space-y-4">
                  {quotes.map((q) => (
                    <div
                      key={q.id}
                      className="rounded-xl border border-gray-150 p-4 space-y-3 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400">
                            REFERENCE: Q-{q.id.split("-")[1].toUpperCase()}
                          </span>
                          <span className="block text-xs font-bold text-slate-900">
                            {q.projectName}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-blue-900">
                          €{q.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded">
                        {q.terms}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-gray-400">
                          Expires: {q.expiryDate}
                        </span>

                        {q.status === "sent" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleQuoteAction(q.id, "accepted")
                              }
                              className="rounded bg-blue-900 text-white text-[10px] font-bold px-2.5 py-1 hover:bg-blue-950 transition cursor-pointer"
                            >
                              Accepter
                            </button>
                            <button
                              onClick={() =>
                                handleQuoteAction(q.id, "rejected")
                              }
                              className="rounded border border-gray-300 text-gray-600 text-[10px] font-bold px-2.5 py-1 hover:bg-gray-50 transition cursor-pointer"
                            >
                              Refuser
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              q.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {q.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {}
            <div className="md:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="font-display text-sm font-bold text-slate-950 border-b border-gray-100 pb-3 text-left">
                Notifications du portail
              </h3>

              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Aucun journal ou avis actif.
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border text-left space-y-1 ${
                        notif.read
                          ? "bg-slate-50 border-gray-150"
                          : "bg-blue-50/50 border-blue-100"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="block text-xs font-bold text-gray-900">
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
                              fetchPortalData();
                            }}
                            className="text-[9px] font-semibold text-blue-900 hover:underline"
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
          </div>
        </div>
      )}

      {}
      {}
      {}
      {activeSubTab === "quotes" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {}
          <div className="md:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-950 border-b border-gray-100 pb-3 text-left">
              Mes demandes de cadrage
            </h3>

            {quoteRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                No active scoping requests. Click "Demander un devis" above to build
                a project requirement profile!
              </div>
            ) : (
              <div className="space-y-4">
                {quoteRequests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-xl border border-gray-150 p-4 space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {req.projectType}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          ["new", "in_review"].includes(req.status)
                            ? "bg-blue-100 text-blue-700"
                            : req.status === "quoted"
                              ? "bg-amber-100 text-amber-700"
                              : req.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {req.requirements}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-[10px] text-gray-400 bg-slate-50 p-2 rounded">
                      <div>
                        <span className="font-bold">Choix de budget :</span>{" "}
                        {req.budget}
                      </div>
                      <div>
                        <span className="font-bold">Choix de délai :</span>{" "}
                        {req.deadline}
                      </div>
                    </div>
                    {req.attachmentName && (
                      <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-blue-900">
                        <FileText className="h-3.5 w-3.5" />
                        <a href={req.attachmentUrl} className="hover:underline">
                          {req.attachmentName}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="md:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-950 border-b border-gray-100 pb-3 text-left">
              Propositions émises
            </h3>

            {quotes.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                Once managers issue your formal proposal, it will display here
                with printable SLA parameters.
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-gray-200 p-4 space-y-3 text-left bg-slate-50/50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Devis formel
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          {q.projectName}
                        </h4>
                      </div>
                      <a
                        href={`/api/files/download/EBI_Quote_Q-${q.id.split("-")[1]}.txt`}
                        className="p-1.5 bg-white border border-gray-200 rounded text-gray-500 hover:text-blue-900 shadow-sm transition"
                        title="Télécharger le document de proposition"
                      >
                        <FileDown className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-2 text-[11px] space-y-1 text-gray-600">
                      <div>
                        <span className="font-bold">Budget proposé :</span> €
                        {q.amount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-semibold">Date d'expiration :</span>{" "}
                        {q.expiryDate}
                      </div>
                      <div className="text-[10px] text-gray-500 leading-relaxed italic mt-2">
                        {q.terms}
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      {q.status === "sent" ? (
                        <>
                          <button
                            onClick={() => handleQuoteAction(q.id, "accepted")}
                            className="flex-1 bg-blue-900 text-white text-[10px] font-bold py-2 rounded shadow-sm hover:bg-blue-950 transition cursor-pointer"
                          >
                            Accepter & Sign SLA
                          </button>
                          <button
                            onClick={() => handleQuoteAction(q.id, "rejected")}
                            className="flex-1 bg-white border border-gray-300 text-gray-600 text-[10px] font-bold py-2 rounded shadow-sm hover:bg-gray-50 transition cursor-pointer"
                          >
                            Refuser Quote
                          </button>
                        </>
                      ) : (
                        <div className="w-full text-center py-1 border rounded text-[10px] uppercase font-bold tracking-wider">
                          Statut du devis :{" "}
                          <span
                            className={
                              q.status === "accepted"
                                ? "text-green-700"
                                : "text-red-700"
                            }
                          >
                            {q.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {}
      {}
      {activeSubTab === "appointments" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-display text-sm font-bold text-slate-950 border-b border-gray-100 pb-3 text-left">
            Horaires de consultation
          </h3>

          {appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              No meetings scheduled. Use "Réserver une consultation" above to secure a
              slot on our calendars!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl border border-gray-150 p-4 text-left space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">
                        {a.title}
                      </span>
                      <span className="block text-[10px] text-gray-500">
                        {a.date} at {a.timeSlot} ({a.timezone})
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        a.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : a.status === "pending"
                            ? "bg-blue-100 text-blue-700"
                            : a.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  {a.adminNotes && (
                    <p className="text-[10px] text-gray-500 leading-relaxed bg-slate-50 p-2 rounded">
                      <span className="font-bold text-slate-900 block">
                        Notes du manager :
                      </span>
                      {a.adminNotes}
                    </p>
                  )}
                  {a.status === "pending" && (
                    <button
                      onClick={() => {
                        const aptsList = clientDb.getAppointments();
                        const found = aptsList.find((ap) => ap.id === a.id);
                        if (found) {
                          found.status = "cancelled";
                          clientDb.setAppointments(aptsList);
                          clientDb.addActivityLog(
                            currentUser.id,
                            currentUser.name,
                            `Annulerled appointment: "${a.title}"`,
                          );
                        }
                        fetchPortalData();
                      }}
                      className="text-[10px] text-red-600 font-bold hover:underline"
                    >
                      Annuler le rendez-vous
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {}
      {}
      {}
      {activeSubTab === "chat" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4 max-w-2xl mx-auto">
          <div className="border-b border-gray-100 pb-3 text-left">
            <h3 className="font-display text-sm font-bold text-slate-950">
              Ligne de support direct du manager
            </h3>
            <span className="text-[10px] text-gray-400">
              Directly converse with EBI Services department heads. Fully
              secured.
            </span>
          </div>

          <div className="h-80 overflow-y-auto bg-slate-50 border border-gray-150 rounded-xl p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start space-x-2 ${
                  m.senderId === currentUser.id
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                    m.senderId === currentUser.id
                      ? "bg-blue-600"
                      : "bg-blue-950"
                  }`}
                >
                  {m.senderId === currentUser.id ? "Me" : "M"}
                </div>
                <div
                  className={`max-w-[70%] rounded-xl px-3 py-2 text-xs shadow-sm ${
                    m.senderId === currentUser.id
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none text-left"
                  }`}
                >
                  <span className="block text-[8px] opacity-60 font-semibold mb-0.5">
                    {m.senderName}
                  </span>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Envoyer un message à notre personnel..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={!chatMessage.trim()}
              className="h-8 w-8 rounded-xl bg-blue-900 text-white flex items-center justify-center hover:bg-blue-950 transition disabled:opacity-45 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {}
      {}
      {}
      {activeSubTab === "documents" && (
        <div className="space-y-6">
          {}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
              dragActive
                ? "border-blue-900 bg-blue-50/40"
                : "border-gray-300 bg-white"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <UploadCloud className="h-10 w-10 text-gray-400" />
              <span className="font-display text-xs font-bold text-slate-900">
                Glissez-déposez le brouillon de cadrage / la documentation RFP
              </span>
              <span className="text-[10px] text-gray-400">
                PDF, Word, Excel, Images (max 10 Mo)
              </span>

              <div className="relative">
                <input
                  type="file"
                  id="vault-file-picker"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("vault-file-picker")?.click()
                  }
                  className="mt-2 text-xs font-bold bg-blue-900 hover:bg-blue-950 text-white px-3.5 py-1.5 rounded-lg shadow cursor-pointer"
                >
                  Parcourir les fichiers manuellement
                </button>
              </div>

              {uploadProgressMsg && (
                <span className="block text-[11px] font-bold text-blue-900 pt-1">
                  {uploadProgressMsg}
                </span>
              )}
            </div>
          </div>

          {}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-950 border-b border-gray-100 pb-3 text-left">
              Journaux du coffre-fort de documents
            </h3>

            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                Vault is empty. Upload your contracts, mock receipts, or
                specifications.
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="rounded-xl border border-gray-150 p-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-900">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-900">
                          {doc.name}
                        </span>
                        <span className="block text-[9px] text-gray-400">
                          {doc.size} •{" "}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={doc.url}
                        className="p-1.5 bg-gray-50 border border-gray-200 hover:text-blue-900 rounded shadow-sm text-gray-500 transition"
                        title="Télécharger le fichier"
                      >
                        <FileDown className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-1.5 bg-gray-50 border border-gray-200 hover:text-red-600 rounded shadow-sm text-gray-500 transition"
                        title="Supprimer le fichier"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {isRequestingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-display text-base font-bold text-slate-900">
                Demander un devis personnalisé
              </h2>
              <button
                onClick={() => setIsRequestingQuote(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleQuoteRequestSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">
                    Secteur d'activité de l'entreprise
                  </label>
                  <select
                    value={quoteIndustry}
                    onChange={(e) => setQuoteIndustry(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  >
                    <option>Vente au détail et commerce électronique</option>
                    <option>Fintech et banque</option>
                    <option>Logistique et transport</option>
                    <option>Santé et pharmacie</option>
                    <option>SaaS et startup technologique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">
                    Choix de la catégorie de projet
                  </label>
                  <select
                    value={quoteType}
                    onChange={(e) => setQuoteType(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  >
                    <option>Application SaaS Web</option>
                    <option>Système ERP personnalisé</option>
                    <option>Sélection et recrutement informatique</option>
                    <option>Externalisation de centre d'appels bilingue</option>
                    <option>Support administratif back-office</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">
                    Allocation de budget
                  </label>
                  <select
                    value={quoteBudget}
                    onChange={(e) => setQuoteBudget(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  >
                    <option>€5,000 - €10,000</option>
                    <option>€10,000 - €25,000</option>
                    <option>€25,000 - €50,000</option>
                    <option>€50,000 - €100,000</option>
                    <option>€100,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">
                    Délai de livraison
                  </label>
                  <select
                    value={quoteDeadline}
                    onChange={(e) => setQuoteDeadline(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  >
                    <option>1 mois (Urgent)</option>
                    <option>3 mois</option>
                    <option>6 mois</option>
                    <option>Calendrier flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">
                  Marque de spécification des exigences *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Décrivez vos paramètres techniques, votre sélection de pile, votre liste de fonctionnalités ou vos besoins en matière de sièges pour les opérations quotidiennes..."
                  value={quoteRequirements}
                  onChange={(e) => setQuoteRequirements(e.target.value)}
                  className="w-full rounded border border-gray-200 p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              {}
              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">
                  Télécharger la demande de propositions de cadrage (Facultatif)
                </label>
                <input
                  type="file"
                  onChange={handleQuoteAttachmentInput}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploadedFile && (
                  <span className="block mt-1 text-[10px] text-green-700 font-semibold">
                    ✓ Ci-joint : {uploadedFile.name}
                  </span>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-blue-950 text-white rounded-lg py-2.5 text-xs font-semibold shadow transition cursor-pointer"
                >
                  Soumettre une demande de devis
                </button>
                <button
                  type="button"
                  onClick={() => setIsRequestingQuote(false)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg px-4 py-2.5 text-xs transition cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {isBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-display text-base font-bold text-slate-900">
                Réserver une consultation SLA
              </h2>
              <button
                onClick={() => setIsBooking(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAppointmentBooking} className="space-y-3">
              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">
                  Objectif de la réunion *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex. Lancement de l'intégration ERP et examen de la tarification"
                  value={aptTitle}
                  onChange={(e) => setAptTitle(e.target.value)}
                  className="w-full rounded border border-gray-200 p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">
                  Date prévue *
                </label>
                <input
                  type="date"
                  required
                  value={aptDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setAptDate(e.target.value)}
                  className="w-full rounded border border-gray-200 p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">
                  Sélection de créneau horaire
                </label>
                <select
                  value={aptSlot}
                  onChange={(e) => setAptSlot(e.target.value)}
                  className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                >
                  <option>09:00 AM - 10:00 AM</option>
                  <option>10:00 AM - 11:00 AM</option>
                  <option>11:30 AM - 12:30 PM</option>
                  <option>02:00 PM - 03:00 PM</option>
                  <option>03:30 PM - 04:30 PM</option>
                  <option>05:00 PM - 06:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-500 mb-1">
                  Prise en charge du fuseau horaire
                </label>
                <select
                  value={aptTimezone}
                  onChange={(e) => setAptTimezone(e.target.value)}
                  className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                >
                  <option>Europe/Paris (CET)</option>
                  <option>America/New_York (EST)</option>
                  <option>Asia/Singapore (SGT)</option>
                  <option>UTC / GMT</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-blue-950 text-white rounded-lg py-2.5 text-xs font-semibold shadow transition cursor-pointer"
                >
                  Réserver un créneau sur le calendrier
                </button>
                <button
                  type="button"
                  onClick={() => setIsBooking(false)}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg px-4 py-2.5 text-xs transition cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
