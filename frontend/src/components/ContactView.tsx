import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import { clientDb } from "../clientDb";
import { Lead } from "../types";

interface ContactViewProps {
  onLeadSubmitSuccess?: () => void;
}

export default function ContactView({ onLeadSubmitSuccess }: ContactViewProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [budget, setBudget] = useState("€10,000 - €25,000");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !projectDescription) {
      setErrorMsg("Please fill in all required fields marked with *");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const leads = clientDb.getLeads();
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name,
        company: company || "Individual",
        email,
        phone,
        country: "France",
        projectDescription,
        budget,
        deadline: "Flexible (2026)",
        status: "new",
        suggestedDepartment: projectDescription
          .toLowerCase()
          .includes("recruit")
          ? "Recruitment"
          : projectDescription.toLowerCase().includes("call") ||
              projectDescription.toLowerCase().includes("support")
            ? "Outsourcing"
            : "Development",
        priority: "medium",
        createdAt: new Date().toISOString(),
      };

      leads.push(newLead);
      clientDb.setLeads(leads);

      clientDb.addNotification(
        "usr-admin",
        "New Web Lead Registered",
        `${name} from ${company || "Individual"} submitted a new project proposal for €${budget}.`,
      );

      setSubmitted(true);

      setName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setProjectDescription("");
      if (onLeadSubmitSuccess) onLeadSubmitSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: <Phone className="h-5 w-5 text-blue-900" />,
      title: "Tunisie",
      detail: "+216 56 566 533",
      desc: "Appelez notre équipe en Tunisie pour des consultations.",
      link: "tel:+21656566533"
    },
    {
      icon: <Phone className="h-5 w-5 text-blue-900" />,
      title: "Belgique",
      detail: "+32 460 24 17 40",
      desc: "Appelez notre bureau en Belgique pour une assistance.",
      link: "tel:+32460241740"
    },
    {
      icon: <Mail className="h-5 w-5 text-blue-900" />,
      title: "Email",
      detail: "servicesdossiers@gmail.com",
      desc: "Soumettez directement des demandes détaillées.",
      link: "mailto:servicesdossiers@gmail.com"
    }
  ];

  const faqs = [
    {
      q: "Comment EBI Services peut-elle améliorer nos performances digitales ?",
      a: "Nous proposons des solutions personnalisées adaptées à vos besoins pour optimiser vos infrastructures IT et garantir la sécurité de vos données.",
    },
    {
      q: "Dans quels pays opérez-vous ?",
      a: "Avec plus de 8 ans d'expérience, nous accompagnons nos partenaires à travers plus de 5 pays.",
    },
    {
      q: "Proposez-vous des solutions sur mesure ?",
      a: "Oui, notre priorité est de concevoir des solutions technologiques hautement personnalisées pour répondre spécifiquement aux enjeux de nos partenaires.",
    }
  ];

  return (
    <div className="space-y-16 py-8">
      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto space-y-3 pt-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Contactez-nous
        </span>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 sm:text-5xl">
          Coordonnez-vous avec nos directeurs
        </h1>
        <p className="text-xs text-gray-400">
          Vous avez un projet d'entreprise ou une exigence opérationnelle ? Soumettez les détails ci-dessous pour enregistrer une demande ou visitez nos bureaux de Paris.
        </p>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {}
          <div className="md:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-slate-900 mb-4">
              Formulaire de contact entreprise
            </h2>

            {submitted ? (
              <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold text-green-900">
                  Enregistrement de la demande réussi
                </h3>
                <p className="text-xs text-green-800 leading-relaxed max-w-sm mx-auto">
                  Merci ! Vos informations ont été enregistrées dans notre base de données. Notre agent de classification IA a acheminé votre demande vers le service approprié. L'un de nos directeurs régionaux vous contactera dans les 2 heures.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-green-700 hover:underline"
                >
                  Soumettre une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Votre nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex. Marc Dubreuil"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Adresse e-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ex. marc.d@carrefour.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="ex. +33 6 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Choix du département SLA
                    </label>
                    <select className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none">
                      <option>Développement de logiciels sur mesure</option>
                      <option>Recrutement technique informatique</option>
                      <option>Télé-services et externalisation de centre d'appels</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Estimation du budget
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    >
                      <option>€5,000 - €10,000</option>
                      <option>€10,000 - €25,000</option>
                      <option>€25,000 - €50,000</option>
                      <option>€50,000 - €100,000</option>
                      <option>€100,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Description et exigences du projet *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Décrivez votre exigence opérationnelle, le projet de portée ou les exigences de profil de talent..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 hover:bg-blue-950 text-white rounded-lg py-3 text-xs font-semibold shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>
                    {isSubmitting
                      ? "Enregistrement de la demande..."
                      : "Soumettre les détails de la demande"}
                  </span>
                </button>
              </form>
            )}
          </div>

          {}
          <div className="md:col-span-5 space-y-6">
            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
              {contactCards.map((card, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-150 bg-white p-4 shadow-sm flex items-start space-x-3 text-left"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    {card.icon}
                  </div>
                  <div>
                    <span className="block font-display text-xs font-bold text-slate-900">
                      {card.title}
                    </span>
                    <a href={card.link} className="block mt-0.5 text-xs font-bold text-blue-900 hover:underline">
                      {card.detail}
                    </a>
                    <span className="block mt-0.5 text-[11px] text-gray-400 leading-snug">
                      {card.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
              <span className="block font-display text-xs font-bold text-slate-900">
                Nos emplacements
              </span>

              <div className="relative rounded-lg h-44 bg-slate-100 border border-gray-200 overflow-hidden flex flex-col justify-between p-4">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>

                {/* Location Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="bg-red-500 rounded-full h-3 w-3 shadow animate-ping absolute"></div>
                  <div className="bg-red-600 rounded-full h-3 w-3 border-2 border-white shadow z-20"></div>
                </div>

                <div className="z-10 bg-white/95 backdrop-blur border border-gray-150 rounded p-2 text-[10px] w-fit shadow-sm">
                  <span className="block font-semibold">
                    EBI Services
                  </span>
                  <span className="text-gray-400">
                    Tunisie & Belgique
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Questions fréquentes
          </span>
          <h2 className="font-display text-2.5xl font-bold text-slate-900">
            Foire aux questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-150 bg-white p-6 shadow-sm space-y-2 text-left"
            >
              <span className="block font-display text-xs font-semibold text-slate-900">
                ❓ {faq.q}
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
