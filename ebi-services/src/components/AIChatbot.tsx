import React, { useState, useRef, useEffect } from "react";
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

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface AIChatbotProps {
  currentUser: any;
  onLeadSubmitSuccess?: () => void;
}

export default function AIChatbot({
  currentUser,
  onLeadSubmitSuccess,
}: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Bonjour ! Je suis l'assistant IA d'EBI Services. Je peux vous expliquer nos workflows de développement de logiciels sur mesure, nos capacités de recrutement informatique et nos solutions d'externalisation du support client. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  const [leadName, setLeadName] = useState(currentUser?.name || "");
  const [leadCompany, setLeadCompany] = useState(currentUser?.companyId || "");
  const [leadEmail, setLeadEmail] = useState(currentUser?.email || "");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCountry, setLeadCountry] = useState("France");
  const [leadDesc, setLeadDesc] = useState("");
  const [leadBudget, setLeadBudget] = useState("€10,000 - €25,000");
  const [leadDélai, setLeadDélai] = useState("3 mois");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    setTimeout(() => {
      let reply = "";
      const lower = textToSend.toLowerCase();

      if (
        lower.includes("develop") ||
        lower.includes("software") ||
        lower.includes("erp") ||
        lower.includes("custom") ||
        lower.includes("web")
      ) {
        reply =
          "EBI Services conçoit des logiciels sur mesure, des applications Web et des systèmes ERP intégrés ultra-performants. Notre équipe de développement gère la conception de l'architecture de bout en bout, les intégrations d'API et les créateurs de portails robustes. Nous sommes spécialisés dans React, Node et les structures cloud évolutives. Souhaitez-vous que j'ouvre notre outil de devis pour définir un projet technique ?";
      } else if (
        lower.includes("recruit") ||
        lower.includes("talent") ||
        lower.includes("candidate") ||
        lower.includes("hire") ||
        lower.includes("engineer")
      ) {
        reply =
          "Par le biais de notre branche de recrutement informatique Premium, EBI recherche et sélectionne rigoureusement des développeurs et ingénieurs d'élite. Nous pré-évaluons techniquement les candidats afin que vous n'interviewiez que les 3 % des meilleurs talents correspondants. Nous prenons en charge la recherche de développeurs en Europe, en Amérique du Nord et dans le monde entier. Faites-nous savoir si vous souhaitez consulter nos directeurs de recrutement !";
      } else if (
        lower.includes("outsource") ||
        lower.includes("call") ||
        lower.includes("tele") ||
        lower.includes("support") ||
        lower.includes("customer")
      ) {
        reply =
          "EBI Tele-Services propose un support client bilingue professionnel 24h/24 et 7j/7, du télémarketing sortant et de l'externalisation de back-office administratif. Nous maintenons des centres de contact sécurisés et de haute technologie avec des spécialistes hautement qualifiés. Nous pouvons gérer entièrement vos tickets de support ou vos campagnes de génération de leads. Souhaitez-vous une estimation de prix pour l'externalisation du support ?";
      } else if (
        lower.includes("quote") ||
        lower.includes("quotation") ||
        lower.includes("pricing") ||
        lower.includes("price") ||
        lower.includes("cost") ||
        lower.includes("budget")
      ) {
        reply =
          "Je serais ravi de vous guider ! EBI Services propose des stratégies de modèles de tarification flexibles en fonction du service. Ouvrons notre formulaire dynamique de cadrage de projet ci-dessous afin que vous puissiez saisir vos exigences exactes, votre budget et votre calendrier, et nous compilerons un devis instantané dans votre portail !";
        setShowLeadForm(true);
      } else {
        reply =
          "Je vous remercie. EBI Services est un fournisseur d'entreprise spécialisé dans le développement de logiciels sur mesure, le recrutement informatique d'élite et l'externalisation professionnelle du support client et du back-office. Faites-moi savoir à quel domaine se rapporte votre requête, ou n'hésitez pas à demander une consultation pour un devis instantané !";
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }, 850);
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
          text: "💼 [Avis IA] : J'ai automatiquement enregistré votre demande de projet auprès de la direction d'EBI ! Ils vous contacteront sous peu.",
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
        deadline: leadDélai,
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
          text: `Merci, ${leadName}! Votre demande de projet pour "${leadDesc.substring(0, 30)}..." a été reçue. Nos directeurs ont été informés et vérifieront vos exigences.`,
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
      label: "Workflow de développement de logiciels",
      text: "Parlez-moi de vos services de développement de logiciels sur mesure et de vos solutions ERP.",
    },
    {
      label: "Recherche et recrutement informatique",
      text: "Comment EBI aide-t-elle à recruter et à pré-évaluer des candidats ingénieurs techniques ?",
    },
    {
      label: "Télé-services et support",
      text: "Pouvez-vous fournir un centre d'appels sortant ou un support client bilingue entrant ?",
    },
    {
      label: "Demander un devis instantané",
      text: "Je souhaite demander un devis pour un projet d'entreprise sur mesure.",
    },
  ];

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
                  Assistant expert actif
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
                  {m.text}
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
                    Cadrage de demande de devis instantané
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Fill in your project information below. This automatically
                  registers an active lead in our CRM pipeline.
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Votre nom *"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Nom de l'entreprise"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="email"
                      placeholder="Adresse e-mail *"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone *"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Description du projet (ex. intégration ERP, support au recrutement, externalisation de centre d'appels) *"
                    required
                    rows={3}
                    value={leadDesc}
                    onChange={(e) => setLeadDesc(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white p-2 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <label className="block text-[9px] text-gray-500 font-bold uppercase">
                        Fourchette de budget
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
                        Délai
                      </label>
                      <select
                        value={leadDélai}
                        onChange={(e) => setLeadDélai(e.target.value)}
                        className="w-full rounded border border-gray-200 bg-white p-1.5 text-[10px] focus:ring-1 focus:ring-blue-900 focus:outline-none"
                      >
                        <option>Immédiat (1 mois)</option>
                        <option>3 mois</option>
                        <option>6 mois</option>
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
                      {isSubmittingForm ? "Envoi en cours..." : "Enregistrer la demande"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLeadForm(false)}
                      className="border border-gray-300 text-gray-600 rounded px-3 py-2 text-xs hover:bg-gray-100 transition"
                    >
                      Annuler
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
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(action.text)}
                    className="rounded-full bg-white border border-gray-200 px-3 py-1 text-[10px] text-blue-900 font-semibold hover:bg-blue-50 hover:border-blue-300 hover:text-blue-950 shadow-sm text-left transition"
                  >
                    💡 {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {}
          <div className="p-3 border-t border-gray-200 bg-white flex items-center space-x-2">
            <input
              type="text"
              placeholder="Posez vos questions sur nos services..."
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
