import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  TrendingUp,
  HandCoins,
  CalendarRange,
  Search,
  ShieldAlert,
  BadgeHelp,
  CheckCircle2,
  Trash2,
  FileDown,
  RefreshCw,
  Sliders,
  PlayCircle,
  Lock,
  Save,
  Mail,
  MessageCircle,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  User,
  Lead,
  Appointment,
  QuoteRequest,
  Quote,
  ActivityLog,
  SystemSettings,
  Conversation,
  Message,
} from "../types";
import { clientDb } from "../clientDb";

interface AdminViewProps {
  currentUser: User;
  token: string;
}

export default function AdminView({ currentUser, token }: AdminViewProps) {
  const [adminSubTab, setAdminSubTab] = useState<
    "dashboard" | "crm" | "quotes" | "appointments" | "settings" | "logs" | "messages"
  >("dashboard");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const [leadSearch, setLeadSearch] = useState("");
  const [leadDeptFilter, setLeadDeptFilter] = useState("all");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");

  const [selectedReq, setSelectedReq] = useState<QuoteRequest | null>(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteTerms, setQuoteTerms] = useState(
    "Net 30. 40% upfront, 30% intermediate milestone, 30% delivery. Includes standard 6-month technical support warranty.",
  );
  const [isIssuingQuote, setIsIssuingQuote] = useState(false);

  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [leadNoteText, setLeadNoteText] = useState("");

  const [editingAptId, setEditingAptId] = useState<string | null>(null);
  const [aptNoteText, setAptNoteText] = useState("");

  const [websiteName, setWebsiteName] = useState("");
  const [chatbotPrompt, setChatbotPrompt] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [emailTemplateQuote, setEmailTemplateQuote] = useState("");
  const [emailTemplateAppointment, setEmailTemplateAppointment] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConv]);

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 12000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchAdminData = async () => {
    try {
      const rLeads = clientDb.getLeads();
      const rApts = clientDb.getAppointments();
      const rReqs = clientDb.getQuoteRequests();
      const rQuotes = clientDb.getQuotes();
      const rLogs = clientDb.getLogs();
      const rSettings = clientDb.getSettings();

      const rConvs = clientDb.getConversations();
      const rMsgs = clientDb.getMessages();

      setLeads(rLeads);
      setAppointments(rApts);
      setQuoteRequests(rReqs);
      setQuotes(rQuotes);
      setLogs(rLogs);

      try {
        const token = sessionStorage.getItem('ebi_access_token');
        const msgsRes = await fetch('http://127.0.0.1:5001/api/messages', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (msgsRes.ok) {
          const apiMsgs = await msgsRes.json();
          const dynamicConvsMap = new Map<string, Conversation>();

          const mappedApiMsgs: Message[] = apiMsgs.map((m: any) => {
             const clientId = m.client?._id || m.client || "unknown";
             const clientName = m.client?.fullname || "Unknown Client";
             const isClientSender = (m.expediteur?._id || m.expediteur) === clientId;

             if (!dynamicConvsMap.has(clientId)) {
                 dynamicConvsMap.set(clientId, {
                     id: `conv-${clientId}`,
                     userId: clientId,
                     clientName: clientName,
                     clientEmail: m.client?.email || "Unknown",
                     status: "active",
                     summary: m.contenu?.substring(0, 30) + "...",
                     lastMessageAt: m.createdAt
                 });
             } else {
                 const c = dynamicConvsMap.get(clientId)!;
                 if (new Date(m.createdAt) > new Date(c.lastMessageAt)) {
                     c.lastMessageAt = m.createdAt;
                     c.summary = m.contenu?.substring(0, 30) + "...";
                 }
             }

             return {
                id: m._id,
                conversationId: `conv-${clientId}`,
                senderId: m.expediteur?._id || m.expediteur,
                senderName: isClientSender ? clientName : "Admin",
                senderRole: isClientSender ? "client" : "admin",
                text: m.contenu,
                timestamp: m.createdAt
             };
          });

          const sortedConvs = [...rConvs.filter(lc => !dynamicConvsMap.has(lc.userId)), ...Array.from(dynamicConvsMap.values())].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
          setConversations(sortedConvs);
          setMessages([...rMsgs, ...mappedApiMsgs]);
          
          if (!selectedConv && sortedConvs.length > 0) {
            setSelectedConv(sortedConvs[0]);
          }
        } else {
          setConversations(rConvs);
          setMessages(rMsgs);
          if (!selectedConv && rConvs.length > 0) {
            setSelectedConv(rConvs[0]);
          }
        }
      } catch (e) {
        console.error("Failed to fetch API messages for AdminView", e);
        setConversations(rConvs);
        setMessages(rMsgs);
        if (!selectedConv && rConvs.length > 0) {
          setSelectedConv(rConvs[0]);
        }
      }

      const totalLeads = rLeads.length;
      const totalClients = clientDb
        .getUsers()
        .filter((u) => u.role === "client").length;

      const acceptedQuotes = rQuotes.filter((q) => q.status === "accepted");
      const revenue = acceptedQuotes.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );

      const pendingQuotes = rQuotes.filter((q) => q.status === "sent").length;
      const pendingQuoteAmount = rQuotes
        .filter((q) => q.status === "sent")
        .reduce((acc, curr) => acc + curr.amount, 0);

      const conversionRate =
        rQuotes.length > 0
          ? Math.round((acceptedQuotes.length / rQuotes.length) * 100)
          : 0;

      const requestsByDept: Record<string, number> = {
        Development: 0,
        Recruitment: 0,
        Outsourcing: 0,
      };
      rLeads.forEach((l) => {
        const dept = l.suggestedDepartment || "Development";
        if (requestsByDept[dept] !== undefined) {
          requestsByDept[dept]++;
        } else {
          requestsByDept[dept] = 1;
        }
      });

      const monthlyRevenue = [
        { name: "Jan", revenue: Math.round(revenue * 0.15) },
        { name: "Feb", revenue: Math.round(revenue * 0.25) },
        { name: "Mar", revenue: Math.round(revenue * 0.4) },
        { name: "Apr", revenue: Math.round(revenue * 0.6) },
        { name: "May", revenue: Math.round(revenue * 0.85) },
        { name: "Jun", revenue: revenue },
      ];

      setAnalytics({
        totalLeads,
        totalClients,
        revenue,
        pendingQuotes,
        pendingQuoteAmount,
        conversionRate,
        requestsByDept,
        monthlyRevenue,
      });

      if (rSettings) {
        setSettings(rSettings);
        setWebsiteName(rSettings.websiteName || "");
        setChatbotPrompt(rSettings.chatbotPrompt || "");
        setWelcomeMessage(rSettings.welcomeMessage || "");
        setEmailTemplateQuote(rSettings.emailTemplateQuote || "");
        setEmailTemplateAppointment(rSettings.emailTemplateAppointment || "");
      }
    } catch (e) {
      console.error("Admin fetch failed:", e);
    }
  };

  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    try {
      const leadsList = clientDb.getLeads();
      const updatedList = leadsList.map((l) => {
        if (l.id === leadId) {
          return { ...l, ...updates };
        }
        return l;
      });
      clientDb.setLeads(updatedList);

      clientDb.addActivityLog(
        currentUser.id,
        currentUser.name,
        `Updated lead ID ${leadId} status/notes`,
      );
      setEditingLeadId(null);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = (leadId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this lead? This action cannot be undone.",
      )
    )
      return;
    try {
      const leadsList = clientDb.getLeads();
      const filtered = leadsList.filter((l) => l.id !== leadId);
      clientDb.setLeads(filtered);

      clientDb.addActivityLog(
        currentUser.id,
        currentUser.name,
        `Deleted lead ID ${leadId}`,
      );
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppointment = (
    aptId: string,
    status: "pending" | "confirmed" | "cancelled" | "completed",
    customNotes?: string,
  ) => {
    try {
      const aptsList = clientDb.getAppointments();
      const found = aptsList.find((a) => a.id === aptId);
      if (found) {
        found.status = status;
        if (customNotes !== undefined) found.adminNotes = customNotes;
        clientDb.setAppointments(aptsList);

        clientDb.addNotification(
          found.userId,
          `Appointment ${status.toUpperCase()}`,
          `Your consultation requested on ${found.date} ("${found.title}") is now ${status}.`,
        );

        clientDb.addActivityLog(
          currentUser.id,
          currentUser.name,
          `Updated appointment ${aptId} to ${status}`,
        );
      }

      setEditingAptId(null);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssueQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq || !quoteAmount) return;

    setIsIssuingQuote(true);
    try {
      const quotesList = clientDb.getQuotes();
      const newQuote: Quote = {
        id: `q-${Math.random().toString(36).substring(2, 11)}`,
        quoteRequestId: selectedReq.id,
        clientName: selectedReq.clientName,
        projectName: selectedReq.projectType,
        amount: parseFloat(quoteAmount),
        terms: quoteTerms,
        status: "sent",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        createdAt: new Date().toISOString(),
      };
      quotesList.push(newQuote);
      clientDb.setQuotes(quotesList);

      const reqList = clientDb.getQuoteRequests();
      const req = reqList.find((r) => r.id === selectedReq.id);
      if (req) {
        req.status = "quoted";
        clientDb.setQuoteRequests(reqList);
      }

      clientDb.addNotification(
        selectedReq.userId,
        "Formal SLA Pricing Generated",
        `A custom quotation of €${parseFloat(quoteAmount).toLocaleString()} is ready for your project "${selectedReq.projectType}".`,
      );

      clientDb.addActivityLog(
        currentUser.id,
        currentUser.name,
        `Issued quotation of €${quoteAmount} for "${selectedReq.projectType}"`,
      );

      setSelectedReq(null);
      setQuoteAmount("");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsIssuingQuote(false);
    }
  };

  const handleSaveSettings = () => {
    try {
      const newSettings: SystemSettings = {
        websiteName,
        chatbotPrompt,
        welcomeMessage,
        emailTemplateQuote,
        emailTemplateAppointment,
      };
      clientDb.setSettings(newSettings);

      clientDb.addActivityLog(
        currentUser.id,
        currentUser.name,
        `Updated system configurations`,
      );
      alert("EBI System Configurations saved successfully!");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = (reportType: "leads" | "quotes" | "financials") => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportType === "leads") {
      csvContent +=
        "ID,Name,Company,Email,Phone,Department,Priority,Status,Created At\n";
      leads.forEach((l) => {
        csvContent += `"${l.id}","${l.name}","${l.company}","${l.email}","${l.phone}","${l.suggestedDepartment || "Development"}","${l.priority || "medium"}","${l.status}","${l.createdAt}"\n`;
      });
    } else if (reportType === "quotes") {
      csvContent +=
        "QuoteID,Client,Project,Amount,Status,Expiry Date,Created At\n";
      quotes.forEach((q) => {
        csvContent += `"${q.id}","${q.clientName}","${q.projectName}",${q.amount},"${q.status}","${q.expiryDate}","${q.createdAt}"\n`;
      });
    } else {
      csvContent += "Financial Metric,Value\n";
      csvContent += `"Total CRM Leads",${leads.length}\n`;
      csvContent += `"Clients actifs",${analytics?.totalClients || 0}\n`;
      csvContent += `"Pending Propositions de devis",${analytics?.pendingQuotes || 0}\n`;
      csvContent += `"Accepted Project Revenue",${analytics?.revenue || 0}\n`;
      csvContent += `"Corporate Conversion Rate",${analytics?.conversionRate || 0}%\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `EBI_Services_CRM_Report_${reportType}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !replyText.trim()) return;

    try {
      try {
        await fetch('http://127.0.0.1:5001/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            client: selectedConv.userId,
            expediteur: currentUser.id,
            contenu: replyText
          })
        });
      } catch (err) {
        console.error("Backend message failed", err);
      }

      const msgsList = clientDb.getMessages();
      const newMsg: Message = {
        id: `msg-${Math.random().toString(36).substring(2, 11)}`,
        conversationId: selectedConv.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        text: replyText,
        timestamp: new Date().toISOString(),
      };
      clientDb.setMessages([...msgsList, newMsg]);

      const convsList = clientDb.getConversations();
      const conv = convsList.find(c => c.id === selectedConv.id);
      if (conv) {
        conv.lastMessageAt = new Date().toISOString();
        clientDb.setConversations(convsList);
      }

      setReplyText("");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.company.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (lead.projectDescription || "")
        .toLowerCase()
        .includes(leadSearch.toLowerCase());

    const matchesDept =
      leadDeptFilter === "all" || lead.suggestedDepartment === leadDeptFilter;
    const matchesStatus =
      leadStatusFilter === "all" || lead.status === leadStatusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const revenueChartData = analytics?.monthlyRevenue || [];

  const deptPieData = analytics?.requestsByDept
    ? Object.keys(analytics.requestsByDept).map((key) => ({
        name: key,
        value: analytics.requestsByDept[key],
      }))
    : [];

  const COLORS = ["#1e3a8a", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-100 flex items-center w-fit gap-1.5 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            Centre de commande CRM exécutif
          </span>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Tableau de bord EBI CRM et SLA
          </h1>
          <p className="text-xs text-gray-500">
            Autorisation d'administration sécurisée active : {currentUser.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => fetchAdminData()}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500 shadow-sm bg-white cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleExportCSV("leads")}
            className="rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white px-3.5 py-2 text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <FileDown className="h-4 w-4" />
            <span>Exporter les prospects</span>
          </button>
          <button
            onClick={() => handleExportCSV("financials")}
            className="rounded-lg bg-blue-900 hover:bg-blue-950 text-white px-3.5 py-2 text-xs font-semibold shadow flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Exporter les analyses</span>
          </button>
        </div>
      </div>

      {}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6 text-xs font-bold tracking-wide uppercase">
          {[
            { id: "dashboard", label: "Analyses CRM" },
            { id: "crm", label: "Gérer les prospects" },
            { id: "quotes", label: "Propositions de devis" },
            { id: "appointments", label: "Tableau des rendez-vous" },
            { id: "messages", label: "Messages" },
            { id: "settings", label: "Configurations système" },
            { id: "logs", label: "Journaux d'audits" },
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setAdminSubTab(sub.id as any)}
              className={`py-2 border-b-2 cursor-pointer transition-all ${
                adminSubTab === sub.id
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
      {adminSubTab === "dashboard" && (
        <div className="space-y-8">
          {}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-left">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">
                Total des prospects
              </span>
              <span className="block text-2.5xl font-extrabold text-slate-900 mt-1">
                {analytics?.totalLeads || 0}
              </span>
              <span className="block text-[9px] text-gray-500 mt-1">
                Prospects acquis
              </span>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-left">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">
                Clients actifs
              </span>
              <span className="block text-2.5xl font-extrabold text-slate-900 mt-1">
                {analytics?.totalClients || 0}
              </span>
              <span className="block text-[9px] text-gray-500 mt-1">
                Comptes portail
              </span>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-left">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">
                Conversion SLA
              </span>
              <span className="block text-2.5xl font-extrabold text-slate-900 mt-1">
                {analytics?.conversionRate || 0}%
              </span>
              <span className="block text-[9px] text-gray-500 mt-1">
                Entonnoir d'acceptation
              </span>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-left">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">
                Revenus acceptés
              </span>
              <span className="block text-2.5xl font-extrabold text-emerald-700 mt-1">
                €{(analytics?.revenue || 0).toLocaleString()}
              </span>
              <span className="block text-[9px] text-gray-500 mt-1">
                Contrats signés
              </span>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm text-left">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">
                Devis en attente
              </span>
              <span className="block text-2.5xl font-extrabold text-amber-600 mt-1">
                €{(analytics?.pendingQuoteAmount || 0).toLocaleString()}
              </span>
              <span className="block text-[9px] text-gray-500 mt-1">
                Devis en attente du client
              </span>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {}
            <div className="md:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-left space-y-4">
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Performance au fil du temps
                </h3>
                <p className="text-[10px] text-gray-400">
                  Monthly breakdown of contracted revenue against leads
                  ingestion.
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#1e3a8a"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#1e3a8a"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={10} tickLine={false} />
                    <YAxis fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1e3a8a"
                      fillOpacity={1}
                      fill="url(#colorRev)"
                      strokeWidth={2.5}
                      name="Revenue (€)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {}
            <div className="md:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-left space-y-4">
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Prospects par département
                </h3>
                <p className="text-[10px] text-gray-400">
                  Répartition de la demande sur nos trois piliers opérationnels.
                </p>
              </div>
              <div className="h-44 relative flex items-center justify-center">
                {deptPieData.length === 0 ? (
                  <span className="text-xs text-gray-400">
                    No department data.
                  </span>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deptPieData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {deptPieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="space-y-2 text-[10px] border-t border-gray-100 pt-3">
                {deptPieData.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      ></span>
                      {entry.name}
                    </span>
                    <span className="font-bold text-slate-950">
                      {entry.value} leads
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {}
      {}
      {adminSubTab === "crm" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-4 text-left">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-950">
                Prospects CRM acquis
              </h3>
              <p className="text-[10px] text-gray-400">
                Recherchez, filtrez et examinez les demandes de prospects classées par l'IA.
              </p>
            </div>

            {}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des prospects..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="rounded-lg border border-gray-200 pl-8 pr-3 py-2 text-xs w-full sm:w-48 focus:ring-1 focus:ring-blue-900 focus:outline-none"
                />
              </div>
              <select
                value={leadDeptFilter}
                onChange={(e) => setLeadDeptFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none"
              >
                <option value="all">Tous les départements</option>
                <option value="Development">Développement</option>
                <option value="Recruitment">Recrutement</option>
                <option value="Outsourcing">Externalisation</option>
              </select>
              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          {}
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              No matching leads found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-150 text-gray-400 font-bold uppercase tracking-wide">
                    <th className="p-3">Client details</th>
                    <th className="p-3">AI Department</th>
                    <th className="p-3">AI Priority</th>
                    <th className="p-3">Lead Status</th>
                    <th className="p-3">CRM Notes</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50">
                      <td className="p-3 space-y-1 max-w-[200px]">
                        <span className="font-bold text-slate-900 block">
                          {lead.name}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          {lead.company} • {lead.country}
                        </span>
                        <span className="text-[10px] text-blue-900 block">
                          {lead.email}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lead.suggestedDepartment === "Development"
                              ? "bg-blue-50 text-blue-700"
                              : lead.suggestedDepartment === "Recruitment"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {lead.suggestedDepartment || "Development"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            lead.priority === "high"
                              ? "text-red-600"
                              : lead.priority === "medium"
                                ? "text-amber-600"
                                : "text-gray-400"
                          }`}
                        >
                          ● {lead.priority || "medium"}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleUpdateLead(lead.id, {
                              status: e.target.value as any,
                            })
                          }
                          className="border border-gray-200 rounded p-1 text-[10px] bg-white font-semibold focus:outline-none"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="p-3 max-w-xs">
                        {editingLeadId === lead.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={leadNoteText}
                              onChange={(e) => setLeadNoteText(e.target.value)}
                              className="border border-gray-300 rounded p-1 text-[10px] flex-1 focus:outline-none"
                            />
                            <button
                              onClick={() =>
                                handleUpdateLead(lead.id, {
                                  notes: leadNoteText,
                                })
                              }
                              className="p-1 bg-green-600 hover:bg-green-700 text-white rounded"
                            >
                              <Save className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                              {lead.notes || "No CRM comments yet."}
                            </p>
                            <button
                              onClick={() => {
                                setEditingLeadId(lead.id);
                                setLeadNoteText(lead.notes || "");
                              }}
                              className="text-[9px] text-blue-900 font-bold hover:underline"
                            >
                              Edit Note
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {}
      {}
      {}
      {adminSubTab === "quotes" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {}
          <div className="md:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-950 border-b border-gray-100 pb-3 text-left">
              Quote Requests Pipeline
            </h3>

            {quoteRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                No quote requests submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {quoteRequests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-xl border border-gray-150 p-4 space-y-2 text-left hover:border-blue-200 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {req.projectType}
                        </span>
                        <span className="text-[9px] text-gray-400 block">
                          {req.clientName} • {req.company}
                        </span>
                      </div>
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

                    <p className="text-xs text-gray-500 leading-relaxed bg-slate-50 p-2 rounded">
                      {req.requirements}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-[10px] text-gray-400">
                      <div>
                        <span className="font-bold text-slate-900">
                          Budget :
                        </span>{" "}
                        {req.budget}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">
                          Délai :
                        </span>{" "}
                        {req.deadline}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      {req.attachmentName ? (
                        <a
                          href={req.attachmentUrl}
                          className="text-[10px] font-bold text-blue-900 hover:underline"
                        >
                          📎 Attached: {req.attachmentName}
                        </a>
                      ) : (
                        <span className="text-[9px] text-gray-400">
                          No attachments.
                        </span>
                      )}

                      {["new", "in_review"].includes(req.status) && (
                        <button
                          onClick={() => {
                            setSelectedReq(req);
                            setQuoteAmount("");
                          }}
                          className="bg-blue-900 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-blue-950 transition cursor-pointer"
                        >
                          Generate Formal Quote
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="md:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-950 border-b border-gray-100 pb-3 text-left font-semibold">
              Pricing Generator
            </h3>

            {selectedReq ? (
              <form onSubmit={handleIssueQuote} className="space-y-4 text-left">
                <div className="bg-slate-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                  <div>
                    <span className="font-bold text-slate-900">Projet :</span>{" "}
                    {selectedReq.projectType}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Client:</span>{" "}
                    {selectedReq.clientName} ({selectedReq.company})
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">
                      Stated Budget :
                    </span>{" "}
                    {selectedReq.budget}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Quote Pricing Amount (€) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    SLA Contract & Payment Terms
                  </label>
                  <textarea
                    rows={4}
                    value={quoteTerms}
                    onChange={(e) => setQuoteTerms(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isIssuingQuote}
                    className="flex-1 bg-blue-900 hover:bg-blue-950 text-white rounded-lg py-2 text-xs font-semibold shadow disabled:opacity-45"
                  >
                    {isIssuingQuote ? "Issuing..." : "Issue Formal Quote"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReq(null)}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg px-3 py-2 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs">
                Select an active quote request from the left pipeline to load
                the pricing generator.
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {}
      {}
      {adminSubTab === "appointments" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-display text-sm font-bold text-slate-950 border-b border-gray-100 pb-3 text-left">
            SLA Appointments CMD Board
          </h3>

          {appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              No meetings booked.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl border border-gray-150 p-4 text-left space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">
                        {a.title}
                      </span>
                      <span className="block text-[10px] text-gray-500">
                        Client: {a.clientName} ({a.clientEmail})
                      </span>
                      <span className="block text-[9px] text-gray-400 mt-1">
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

                  {editingAptId === a.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add scheduling comments..."
                        value={aptNoteText}
                        onChange={(e) => setAptNoteText(e.target.value)}
                        className="border border-gray-300 rounded p-1 text-[10px] flex-1 focus:outline-none"
                      />
                      <button
                        onClick={() =>
                          handleUpdateAppointment(a.id, a.status, aptNoteText)
                        }
                        className="p-1 bg-green-600 hover:bg-green-700 text-white rounded"
                      >
                        <Save className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 bg-slate-50 p-2 rounded">
                        <span className="font-bold text-slate-900 block">
                          SLA Comments:
                        </span>
                        {a.adminNotes || "No supervisor comments yet."}
                      </p>
                      <button
                        onClick={() => {
                          setEditingAptId(a.id);
                          setAptNoteText(a.adminNotes || "");
                        }}
                        className="text-[9px] text-blue-900 font-bold hover:underline"
                      >
                        Edit Comments
                      </button>
                    </div>
                  )}

                  {a.status === "pending" && (
                    <div className="flex gap-2 pt-1 border-t border-gray-100">
                      <button
                        onClick={() =>
                          handleUpdateAppointment(a.id, "confirmed")
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded py-1.5 text-[10px] font-bold cursor-pointer"
                      >
                        Confirm Slot
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateAppointment(a.id, "cancelled")
                        }
                        className="flex-1 bg-white border border-gray-300 text-gray-600 rounded py-1.5 text-[10px] font-bold cursor-pointer hover:bg-gray-50"
                      >
                        Decline
                      </button>
                    </div>
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
      {adminSubTab === "messages" && (
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch h-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Left: Conversation List */}
          <div className="md:col-span-4 border-r border-gray-100 flex flex-col overflow-hidden text-left h-full bg-white">
            <h3 className="font-display text-sm font-bold text-slate-950 p-4 border-b border-gray-100 shrink-0">
              Active Client Threads ({conversations.length})
            </h3>
            <div className="overflow-y-auto flex-1 p-2 space-y-2 min-h-0">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">No active conversations yet.</div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConv(c)}
                    className={`w-full text-left p-3 rounded-lg transition cursor-pointer ${
                      selectedConv?.id === c.id ? "bg-blue-50 border border-blue-200" : "bg-white hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs">{c.clientName}</div>
                    <div className="text-[10px] text-gray-500 truncate">{c.summary || "Conversation started..."}</div>
                    <div className="text-[9px] text-gray-400 mt-1">{new Date(c.lastMessageAt).toLocaleString()}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Chat Messages */}
          <div className="md:col-span-8 flex flex-col text-left h-full overflow-hidden bg-white">
            {selectedConv ? (
              <>
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 shrink-0 bg-white">
                  <div className="h-10 w-10 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center font-bold">
                    {(selectedConv.clientName || "?").charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{selectedConv.clientName}</div>
                    <div className="text-[10px] text-gray-500">{selectedConv.clientEmail}</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-0">
                  {messages.filter(m => m.conversationId === selectedConv.id).map(m => (
                    <div key={m.id} className={`flex ${m.senderRole === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl text-xs ${
                        m.senderRole === "admin" ? "bg-blue-900 text-white rounded-br-none" : "bg-white border border-gray-200 text-slate-900 rounded-bl-none shadow-sm"
                      }`}>
                        <div className="font-bold mb-1">{m.senderName}</div>
                        <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>
                        <div className={`text-[9px] mt-2 ${m.senderRole === "admin" ? "text-blue-200" : "text-gray-400"}`}>
                          {new Date(m.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleReply} className="p-4 border-t border-gray-100 flex gap-2 shrink-0 bg-white">
                  <input
                    type="text"
                    required
                    placeholder="Type a secure admin reply..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none bg-white text-slate-900"
                  />
                  <button type="submit" className="bg-blue-900 hover:bg-blue-950 text-white rounded-lg px-6 py-2.5 text-xs font-bold shadow cursor-pointer">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center space-y-3">
                <MessageCircle className="h-12 w-12 text-gray-200" />
                <p className="text-xs">Select a conversation thread to view messages.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {adminSubTab === "settings" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6 text-left">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-display text-sm font-bold text-slate-950">
              EBI Corporate System Tuner
            </h3>
            <p className="text-[10px] text-gray-400">
              Tweak landing pages, backend email logs, and AI chatbot prompts
              dynamically.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                Corporate Platform Name
              </label>
              <input
                type="text"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                AI Chatbot System Prompt (Instruction Context)
              </label>
              <textarea
                rows={4}
                value={chatbotPrompt}
                onChange={(e) => setChatbotPrompt(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                Chatbot Welcome Greeting Message
              </label>
              <input
                type="text"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                  Email Quote Template Body
                </label>
                <textarea
                  rows={4}
                  value={emailTemplateQuote}
                  onChange={(e) => setEmailTemplateQuote(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                  Email Appointment Template Body
                </label>
                <textarea
                  rows={4}
                  value={emailTemplateAppointment}
                  onChange={(e) => setEmailTemplateAppointment(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="rounded-lg bg-blue-900 hover:bg-blue-950 text-white px-5 py-2.5 text-xs font-bold shadow transition cursor-pointer"
            >
              Commit Dynamic Parameters
            </button>
          </div>
        </div>
      )}

      {}
      {}
      {}
      {adminSubTab === "logs" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="font-display text-sm font-bold text-slate-950 border-b border-gray-100 pb-3 text-left">
            Enterprise Audit Trail Logs
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 rounded-lg border border-gray-150 flex items-center justify-between text-left text-xs"
              >
                <div className="space-y-1">
                  <span className="font-bold text-slate-900">
                    {log.userName} ({log.userId.split("-")[1]})
                  </span>
                  <p className="text-gray-500 leading-none">{log.action}</p>
                </div>
                <span className="text-[10px] text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
