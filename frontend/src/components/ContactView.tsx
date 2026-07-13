import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";

const API_URL = "/api/form-responses/form_response";

interface ContactViewProps {
  onLeadSubmitSuccess?: () => void;
}

export default function ContactView({ onLeadSubmitSuccess }: ContactViewProps) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", need: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Invalid email";
    }
    if (!form.phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!/^[+\d\s\-()]{6,20}$/.test(form.phone)) {
      e.phone = "Invalid phone number";
    }
    if (!form.need.trim()) {
      e.need = "Please describe your need";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Error submitting the form");
      }
      setDone(true);
      if (onLeadSubmitSuccess) onLeadSubmitSuccess();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

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
              Contact Us
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Please fill in your information below.
            </p>

            {done ? (
              <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold text-green-900">
                  Form submitted successfully
                </h3>
                <p className="text-xs text-green-800 leading-relaxed max-w-sm mx-auto">
                  Thank you <strong>{form.name}</strong>! Your form has been received.
                  A confirmation email has been sent to <strong>{form.email}</strong>.
                </p>
                <button
                  onClick={() => { setDone(false); setForm({ name: "", email: "", phone: "", need: "" }); }}
                  className="mt-2 text-xs font-semibold text-green-700 hover:underline"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {submitError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
                    {submitError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Full name
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none"
                    placeholder="+33 6 12 34 56 78"
                    value={form.phone}
                    onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Your need
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:ring-1 focus:ring-blue-900 focus:outline-none resize-none"
                    placeholder="Describe your project or request..."
                    value={form.need}
                    onChange={e => setForm(prev => ({ ...prev, need: e.target.value }))}
                  />
                  {errors.need && <p className="text-xs text-red-500 mt-1">{errors.need}</p>}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-900 hover:bg-blue-950 text-white rounded-lg py-3 text-xs font-semibold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
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
