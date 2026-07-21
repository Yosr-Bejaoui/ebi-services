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
      title: "Direct Operations Support",
      detail: "+33 1 74 88 99 00",
      desc: "Call our general managers for immediate technical consultations.",
    },
    {
      icon: <Mail className="h-5 w-5 text-blue-900" />,
      title: "Electronic Mail desk",
      detail: "contact@ebiservices.com",
      desc: "Submit detailed RFPs, requirements docs, or agency requests directly.",
    },
    {
      icon: <MapPin className="h-5 w-5 text-blue-900" />,
      title: "Global Headquarters",
      detail: "12 Avenue des Champs-Élysées, Paris",
      desc: "Conveniently located in central Paris.",
    },
    {
      icon: <Clock className="h-5 w-5 text-blue-900" />,
      title: "Working Hours",
      detail: "08:30 AM - 06:30 PM (CET)",
      desc: "Our operations desk runs Monday through Friday.",
    },
  ];

  const faqs = [
    {
      q: "What is your typical project delivery timeline for custom software?",
      a: "For medium-sized web/ERP software projects, delivery typically takes 6 to 12 weeks from complete scoping to deployment. Small modules can be delivered within 3-4 weeks under our agile sprint framework.",
    },
    {
      q: "How does EBI Services pre-vet IT candidates in your recruitment division?",
      a: "Every candidate undergoes a mandatory 3-tiered vetting process: (1) Technical CV matching, (2) Live whiteboard programming/architectural challenge, and (3) In-depth HR communications and reference check. We deliver comprehensive reports alongside candidate CVs.",
    },
    {
      q: "What SLAs apply to the outsourcing / tele-services team?",
      a: "Our customer support team guarantees an Average Speed of Answer (ASA) under 90 seconds and maintaining ticket resolution scores above 97%. Supervisors compile weekly performance metrics, available on the client portal.",
    },
    {
      q: "Can I upgrade or downgrade my outsourcing agents package?",
      a: "Yes! EBI is highly agile. Client portal accounts allow managing active packages, adding or removing seats, or adjusting support coverage hours with a 14-day notice.",
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto space-y-3 pt-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Get In Touch
        </span>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 sm:text-5xl">
          Coordinate With Our Directors
        </h1>
        <p className="text-xs text-gray-400">
          Have an enterprise project or operational requirement? Submit details
          below to register an active lead or visit our Paris offices.
        </p>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {}
          <div className="md:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-slate-900 mb-4">
              Enterprise Contact Form
            </h2>

            {submitted ? (
              <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold text-green-900">
                  Lead Registration Successful
                </h3>
                <p className="text-xs text-green-800 leading-relaxed max-w-sm mx-auto">
                  Thank you! Your information has been registered in our
                  database. Our AI classification agent has routed your request
                  to the appropriate department. One of our regional directors
                  will follow up within 2 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-green-700 hover:underline"
                >
                  Submit another inquiry
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
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marc Dubreuil"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. marc.d@carrefour.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +33 6 1234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      SLA Department Choice
                    </label>
                    <select className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none">
                      <option>Custom Software Development</option>
                      <option>IT Technical Recruitment</option>
                      <option>Tele-Services & Call Center Outsourcing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      Estimate Budget
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
                    Project Description & Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your operational requirement, scope draft, or talent profile requirements..."
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
                      ? "Registering Lead..."
                      : "Submit Lead Details"}
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
                    <span className="block mt-0.5 text-xs font-bold text-blue-900">
                      {card.detail}
                    </span>
                    <span className="block mt-0.5 text-[11px] text-gray-400 leading-snug">
                      {card.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
              <span className="block font-display text-xs font-bold text-slate-900">
                Map Directory Location
              </span>

              <div className="relative rounded-lg h-44 bg-slate-100 border border-gray-200 overflow-hidden flex flex-col justify-between p-4">
                {}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>

                {}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="bg-red-500 rounded-full h-3 w-3 shadow animate-ping absolute"></div>
                  <div className="bg-red-600 rounded-full h-3 w-3 border-2 border-white shadow z-20"></div>
                  <div className="mt-1 bg-blue-950 text-white rounded px-2 py-0.5 text-[9px] font-bold shadow whitespace-nowrap z-20">
                    Champs-Élysées, Paris
                  </div>
                </div>

                <div className="z-10 bg-white/95 backdrop-blur border border-gray-150 rounded p-2 text-[10px] w-fit shadow-sm">
                  <span className="block font-semibold">
                    EBI Services Paris
                  </span>
                  <span className="text-gray-400">
                    12 Ave des Champs-Élysées
                  </span>
                </div>

                <div className="z-10 flex justify-between items-center text-[9px] text-gray-400">
                  <span>GPS: 48.8698° N, 2.3075° E</span>
                  <span className="font-semibold text-blue-900 hover:underline cursor-pointer">
                    Open Navigation
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
            Common Questions
          </span>
          <h2 className="font-display text-2.5xl font-bold text-slate-900">
            Frequently Asked Inquiries
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
