import React, { useState, useRef, useEffect, JSX } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  User,
  HelpCircle,
  Calendar,
  Briefcase,
  ChevronDown,
} from "lucide-react";

import { clientDb } from "../clientDb";
import { Lead } from "../types";
import { post, get } from "../api/client";

function renderMarkdown(text: string): JSX.Element[] {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let inList: { items: JSX.Element[]; key: string } | null = null;

  function flushList() {
    if (inList) {
      elements.push(
        <ul key={inList.key} className="list-disc pl-4 space-y-0.5 my-1.5 text-[11px]">
          {inList.items}
        </ul>
      );
      inList = null;
    }
  }

  function inlineFormat(part: string, idx: number): JSX.Element {
    const segments: JSX.Element[] = [];
    let remaining = part;
    let segIdx = 0;
    const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        segments.push(<span key={segIdx++}>{remaining.slice(lastIndex, match.index)}</span>);
      }
      if (match[1]) {
        segments.push(<strong key={segIdx++} className="font-semibold text-blue-900">{match[2]}</strong>);
      } else if (match[3]) {
        segments.push(<code key={segIdx++} className="bg-gray-100 px-1 rounded text-[10px] font-mono">{match[4]}</code>);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < remaining.length) {
      segments.push(<span key={segIdx++}>{remaining.slice(lastIndex)}</span>);
    }
    return <React.Fragment key={idx}>{segments}</React.Fragment>;
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") { i++; continue; }

    if (trimmed.startsWith("|")) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().split("|").filter(c => c !== "").map(c => c.trim());
        if (cells.length > 0) tableRows.push(cells);
        i++;
      }
      if (tableRows.length >= 2) {
        const headerRow = tableRows[0];
        const bodyRows = tableRows.slice(2);
        if (bodyRows.length > 0) {
          elements.push(
            <div key={`tbl-${i}`} className="my-2">
              <table className="w-full text-[11px] border-collapse rounded-lg overflow-hidden shadow-sm border border-gray-300">
                <thead>
                  <tr className="bg-blue-900">
                    {headerRow.map((h, ci) => (
                      <th key={ci} className="px-3 py-2 text-left font-semibold text-white text-[10px] uppercase tracking-wider border-r border-blue-800 last:border-r-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, ri) => (
                    <tr key={ri} className={`${ri % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50/50 transition-colors`}>
                      {row.map((cell, ci) => {
                        const isFirst = ci === 0;
                        return (
                          <td key={ci} className={`px-3 py-1.5 border-t border-gray-200 text-[11px] ${isFirst ? "font-semibold text-blue-900 whitespace-nowrap" : "text-gray-700"} ${ci < row.length - 1 ? "border-r border-gray-100" : ""}`}>
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }
    }

    if (trimmed === "---") {
      elements.push(<hr key={`hr-${i}`} className="my-2 border-gray-200" />);
      i++; continue;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-[11px] font-bold text-blue-950 mt-2 mb-1">
          {trimmed.slice(4)}
        </h3>
      );
      i++; continue;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-xs font-bold text-blue-950 mt-2 mb-1">
          {trimmed.slice(3)}
        </h2>
      );
      i++; continue;
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-sm font-bold text-blue-950 mt-2 mb-1">
          {trimmed.slice(2)}
        </h1>
      );
      i++; continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.slice(2);
      const item = <li key={`li-${i}`}>{inlineFormat(content, 0)}</li>;
      if (inList) {
        inList.items.push(item);
      } else {
        inList = { items: [item], key: `list-${i}` };
      }
      i++; continue;
    }

    elements.push(
      <p key={`p-${i}`} className="text-[11px] leading-relaxed mb-1.5">
        {inlineFormat(line, 0)}
      </p>
    );
    i++;
  }

  flushList();
  return elements;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface AIChatbotProps {
  currentUser: any;
  onLeadSubmitSuccess?: () => void;
  onOpenForm?: () => void;
  onOpenPortal?: () => void;
  onOpenBooking?: () => void;
}

export default function AIChatbot({
  currentUser,
  onLeadSubmitSuccess,
  onOpenForm,
  onOpenPortal,
  onOpenBooking,
}: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am the EBI Services AI Assistant. I can help explain our custom software development workflows, IT recruitment capabilities, and customer support outsourcing solutions.\n\n**You can ask in English or French.**\n\n---\n\nBonjour ! Je suis l'assistant IA d'EBI Services. Je peux vous renseigner sur nos développements logiciels sur mesure, recrutement IT et solutions d'externalisation.\n\n**Vous pouvez poser vos questions en français ou en anglais.**",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [awaitingAppointmentConfirm, setAwaitingAppointmentConfirm] = useState(false);

  const [leadName, setLeadName] = useState(currentUser?.name || "");
  const [leadCompany, setLeadCompany] = useState(currentUser?.companyId || "");
  const [leadEmail, setLeadEmail] = useState(currentUser?.email || "");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCountry, setLeadCountry] = useState("France");
  const [leadDesc, setLeadDesc] = useState("");
  const [leadBudget, setLeadBudget] = useState("€10,000 - €25,000");
  const [leadDeadline, setLeadDeadline] = useState("3 Months");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [conversationLang, setConversationLang] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, showLeadForm]);

  useEffect(() => {
    if (currentUser) {
      setLeadName(currentUser.name);
      setLeadEmail(currentUser.email);
      setLeadCompany(currentUser.companyId || "");
    }
  }, [currentUser]);



  // Detect language based on common patterns
  const detectLang = (text: string): string => {
    const frenchPattern = /[àâäéèêëîïôöùûüç]|^(bonjour|salut|je\s|j'|nous|vous|svp|s'il)/i;
    const englishPattern = /^(hello|hi|hey|i\s|we\s|can\s|how\s|what\s|where\s|when\s|is\s|are\s|please)/i;
    if (frenchPattern.test(text)) return "fr";
    if (englishPattern.test(text)) return "en";
    return "en";
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Compute language for this message (use existing or detect on first message)
    const msgLang = conversationLang || detectLang(textToSend);
    if (!conversationLang) {
      setConversationLang(msgLang);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    // Handle appointment confirmation response locally
    if (awaitingAppointmentConfirm) {
      setAwaitingAppointmentConfirm(false);
      const q = textToSend.toLowerCase().trim();
      const isAffirmative = /^(oui|ouais|ok|d'accord|bien sûr|bien sur|volontiers|je veux|vas-y|vas y|yes|yeah|yep|sure|absolutely|i do|i want|let's|lets|go ahead)/i.test(q) || q === "yes" || q === "oui";
      const isNegative = /^(non|no|nope|pas maintenant|plus tard|not now|later)/i.test(q);
      if (isAffirmative && !isNegative) {
        setIsLoading(false);
        if (currentUser && currentUser.role === "client") {
          setIsOpen(false);
          if (onOpenBooking) onOpenBooking();
          else if (onOpenPortal) onOpenPortal();
        } else {
          const loginText = msgLang === "fr"
            ? "Pour réserver une consultation, vous devez d'abord **vous connecter** en tant que **client** ou **créer un compte**.\n\nUtilisez le bouton **Connexion** en haut de la page."
            : "To book a consultation, you need to **log in** as a **client** or **create an account**.\n\nUse the **Login** button at the top of the page.";
          const loginMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: loginText,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, loginMsg]);
          setIsLoading(false);
        }
        return;
      } else if (isNegative) {
        const declineText = msgLang === "fr"
          ? "D'accord, n'hésitez pas à revenir vers moi si vous changez d'avis."
          : "Alright, feel free to come back if you change your mind.";
        const declineMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: declineText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, declineMsg]);
        setIsLoading(false);
        return;
      }
      // Neither yes nor no — fall through to agent normally
    }

    // Try Python agent API first for AI-powered response
    let agentUsed = false;
    try {
      const body: Record<string, string> = { query: textToSend, lang: msgLang };
      const result = await post<{ response: string; query: string }>(
        '/agent/query',
        body,
      );
      if (result && result.response) {
        const responseText = result.response;

        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: responseText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
        agentUsed = true;

        // If response is an appointment confirmation question, set flag
        if (
          responseText.includes("Would you like to **book an appointment") ||
          responseText.includes("Souhaitez-vous **prendre un rendez-vous")
        ) {
          setAwaitingAppointmentConfirm(true);
        }

        // If response mentions form redirect, navigate to contact form
        if (
          responseText.toLowerCase().includes('formulaire') ||
          responseText.toLowerCase().includes('contact form') ||
          responseText.toLowerCase().startsWith('### contact form')
        ) {
          setTimeout(() => {
            if (onOpenForm) onOpenForm();
          }, 800);
        }
      }
    } catch {}  // Error handled below

    if (!agentUsed) {
      const errorMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "L'agent EBI AI est actuellement indisponible. Veuillez reessayer dans quelques instants ou contacter notre equipe directement par formulaire.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setIsLoading(false);
    }
  };

  const autoRegisterLead = async (analysis: any) => {
    try {
      const leads = clientDb.getLeads();
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: analysis.name || "AI Lead Guest",
        company: analysis.company || "Unknown",
        email: analysis.email || "support@ebiservices.com",
        phone: analysis.phone || "",
        country: analysis.country || "France",
        projectDescription:
          analysis.projectDescription || "Discussed with AI Assistant",
        budget: analysis.budget || "TBD",
        deadline: analysis.deadline || "TBD",
        status: "new",
        suggestedDepartment: "Development",
        priority: "medium",
        createdAt: new Date().toISOString(),
      };
      leads.push(newLead);
      clientDb.setLeads(leads);

      clientDb.addActivityLog(
        "usr-admin",
        "AI Chatbot",
        `Registered automated lead for ${newLead.name}`,
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `lead-ok-${Date.now()}`,
          sender: "bot",
          text: "[AI Notice]: I've automatically registered your project lead with EBI management! They will reach out to you shortly.",
          timestamp: new Date(),
        },
      ]);
      if (onLeadSubmitSuccess) onLeadSubmitSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadDesc) return;

    setIsSubmittingForm(true);
    try {
      const leads = clientDb.getLeads();
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: leadName,
        company: leadCompany || "Individual",
        email: leadEmail,
        phone: leadPhone,
        country: leadCountry,
        projectDescription: leadDesc,
        budget: leadBudget,
        deadline: leadDeadline,
        status: "new",
        suggestedDepartment: leadDesc.toLowerCase().includes("recruit")
          ? "Recruitment"
          : leadDesc.toLowerCase().includes("call") ||
              leadDesc.toLowerCase().includes("support")
            ? "Outsourcing"
            : "Development",
        priority: "high",
        createdAt: new Date().toISOString(),
      };
      leads.push(newLead);
      clientDb.setLeads(leads);

      clientDb.addNotification(
        "usr-admin",
        "New Chat Lead Submitted",
        `${leadName} from ${leadCompany || "Individual"} submitted an instant quote lead: €${leadBudget}.`,
      );

      clientDb.addActivityLog(
        "usr-admin",
        "AI Chatbot",
        `New lead registered via chatbot: ${leadName}`,
      );

      setFormSubmitted(true);
      setShowLeadForm(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `form-success-${Date.now()}`,
          sender: "bot",
          text: `Thank you, ${leadName}! Your project lead for "${leadDesc.substring(0, 30)}..." has been received. Our directors have been notified and will verify your requirements.`,
          timestamp: new Date(),
        },
      ]);
      if (onLeadSubmitSuccess) onLeadSubmitSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const quickActions = [
    {
      label: "Software Development Workflow",
      text: "Tell me about your custom Software Development services and ERP solutions.",
    },
    {
      label: "IT Sourcing & Recruitment",
      text: "How does EBI help recruit and pre-vet technical engineering candidates?",
    },
    {
      label: "Tele-Services & Support",
      text: "Can you provide outbound call center or inbound bilingual customer support?",
    },
    {
      label: "Request an Instant Quote",
      text: "I would like to request a quotation for a custom enterprise project.",
    },
  ];
  const handleOpenForm = () => {
    const formMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: "### Contact Form\n\nI'm redirecting you to our contact form.\n\nPlease fill in your information :\n- Name\n- Email\n- Phone\n- Your request\n\nOur team will get back to you shortly.",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, formMsg]);
    setTimeout(() => {
      if (onOpenForm) onOpenForm();
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {}
      {isOpen && (
        <div className="mb-4 flex h-[580px] w-96 flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 overflow-hidden max-w-[calc(100vw-2rem)]">
          {}
          <div className="flex items-center justify-between bg-blue-950 p-4 text-white">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="font-display text-sm font-bold block">
                  EBI AI Consulting
                </span>
                <span className="text-[10px] text-blue-200 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Active Expert Assistant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white rounded-full p-1 hover:bg-white/10 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start space-x-2 ${
                  m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {}
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-950 text-white"
                  }`}
                >
                  {m.sender === "user" ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    "AI"
                  )}
                </div>

                {}
                <div
                  className={`max-w-[75%] rounded-xl px-3.5 py-2.5 text-xs shadow-sm ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-none leading-relaxed"
                  }`}
                >
                  {m.sender === "bot" ? renderMarkdown(m.text) : m.text}
                </div>
              </div>
            ))}

            {}
            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-950 text-white text-xs">
                  AI
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm rounded-tl-none">
                  <div className="flex space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}

            {}
            {showLeadForm && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-blue-950">
                  <Briefcase className="h-4 w-4" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider">
                    Instant Quote Lead Scoper
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Fill in your project information below. This automatically
                  registers an active lead in our CRM pipeline.
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="email"
                      placeholder="Email Address *"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone *"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Project Description (e.g. ERP integration, recruitment support, call center outsourcing) *"
                    required
                    rows={3}
                    value={leadDesc}
                    onChange={(e) => setLeadDesc(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <label className="block text-[9px] text-gray-500 font-bold uppercase">
                        Budget Range
                      </label>
                      <select
                        value={leadBudget}
                        onChange={(e) => setLeadBudget(e.target.value)}
                        className="w-full rounded border border-gray-200 bg-white p-1.5 text-[10px] focus:ring-1 focus:ring-blue-900 focus:outline-none"
                      >
                        <option>€5,000 - €10,000</option>
                        <option>€10,000 - €25,000</option>
                        <option>€25,000 - €50,000</option>
                        <option>€50,000 - €100,000</option>
                        <option>€100,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-500 font-bold uppercase">
                        Deadline
                      </label>
                      <select
                        value={leadDeadline}
                        onChange={(e) => setLeadDeadline(e.target.value)}
                        className="w-full rounded border border-gray-200 bg-white p-1.5 text-[10px] focus:ring-1 focus:ring-blue-900 focus:outline-none"
                      >
                        <option>Immediate (1 mo)</option>
                        <option>3 Months</option>
                        <option>6 Months</option>
                        <option>Flexible (2026)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmittingForm}
                      className="flex-1 bg-blue-900 hover:bg-blue-950 text-white rounded py-2 text-xs font-semibold transition shadow-sm disabled:opacity-55"
                    >
                      {isSubmittingForm ? "Submitting..." : "Register Lead"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLeadForm(false)}
                      className="border border-gray-300 text-gray-600 rounded px-3 py-2 text-xs hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {}
          {!showLeadForm && (
            <div className="p-2 border-t border-gray-150 bg-slate-50/50">
              <div className="flex flex-wrap gap-1.5 p-1 max-h-24 overflow-y-auto">
                <button
                  onClick={handleOpenForm}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 border-0 px-3 py-1 text-[10px] text-white font-semibold hover:from-purple-700 hover:to-pink-700 shadow-sm transition"
                >
                  Contact Form
                </button>
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(action.text)}
                    className="rounded-full bg-white border border-gray-200 px-3 py-1 text-[10px] text-blue-900 font-semibold hover:bg-blue-50 hover:border-blue-300 hover:text-blue-950 shadow-sm text-left transition"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {}
          <div className="p-3 border-t border-gray-200 bg-white flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask anything about our services..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSendMessage(inputText)
              }
              disabled={isLoading || showLeadForm}
              className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isLoading || showLeadForm}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-900 text-white hover:bg-blue-950 transition disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-900 text-white shadow-xl hover:bg-blue-950 transition-all duration-300 border border-blue-950/20 active:scale-95 animate-bounce hover:animate-none"
        title="Chat with AI"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
