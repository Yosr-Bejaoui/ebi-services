import React from "react";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
  Award,
  BarChart3,
  ChevronRight,
  MessageSquareCode,
} from "lucide-react";

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  onOpenChat: () => void;
}

export default function HomeView({ setActiveTab, onOpenChat }: HomeViewProps) {
  const stats = [
    { value: "98.7%", label: "SLA Code Delivery", desc: "Always on schedule" },
    {
      value: "450+",
      label: "Vetted Engineers",
      desc: "Rigorous tech screening",
    },
    { value: "24/7", label: "Global Coverage", desc: "Bilingual operators" },
    {
      value: "€15M+",
      label: "Client Revenue Optimized",
      desc: "Through custom ERPs",
    },
  ];

  const benefits = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      title: "Rapid Execution & Integration",
      desc: "Our agile development team delivers complete custom systems in record time without compromising security or clean structures.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
      title: "Bank-Grade Technical Audits",
      desc: "Every contract, line of code, and administrative tele-support desk undergoes thorough compliance vetting and security audits.",
    },
    {
      icon: <Award className="h-6 w-6 text-blue-600" />,
      title: "Elite Pre-Screened Talent",
      desc: "Skip the hiring noise. EBI recruitment handles candidate screenings, whiteboard tests, and HR matching dynamically.",
    },
  ];

  const testimonials = [
    {
      quote:
        "EBI Services completely revolutionized our logistics workflow. The custom ERP they engineered reduced our dispatch latency by 45%. Production quality is flawless.",
      author: "Yannick Le Gall",
      role: "VP Operations, Carrefour Logistics",
    },
    {
      quote:
        "We hired 6 senior React architects via EBI within a fortnight. Their vetting process is incredibly thorough—every engineer fit perfectly into our product lifecycle.",
      author: "Elena Petrova",
      role: "Engineering Director, Cyberdyne Systems",
    },
  ];

  const partners = [
    "Aura Fintech",
    "Cyberdyne Systems",
    "Carrefour France",
    "Innovatech Sourcing",
    "Global Tele-Hub",
  ];

  return (
    <div className="space-y-16 py-8">
      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 max-w-3xl mx-auto pt-8">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-900 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Driven Corporate Solutions</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-none">
            Scale Your Enterprise Operations with{" "}
            <span className="text-blue-900">EBI Services</span>
          </h1>

          <p className="text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
            High-performance Custom Software Development, world-class IT
            Technical Recruitment, and elite 24/7 Back-Office & Customer Support
            Outsourcing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab("contact")}
              className="w-full sm:w-auto rounded-xl bg-blue-900 hover:bg-blue-950 text-white px-6 py-3.5 text-xs font-bold shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3.5 text-xs font-bold shadow-sm transition"
            >
              Become Client Portal Member
            </button>
            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-6 py-3.5 text-xs font-bold transition flex items-center justify-center space-x-1.5"
            >
              <MessageSquareCode className="h-4 w-4" />
              <span>Talk with AI Consulting</span>
            </button>
          </div>
        </div>
      </section>

      {}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
            Trusted by Global Operations Leaders
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {partners.map((partner, i) => (
              <span
                key={i}
                className="font-display text-xs font-bold text-slate-600 uppercase tracking-widest"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center"
            >
              <span className="block font-display text-3xl font-extrabold text-blue-950 sm:text-4xl">
                {stat.value}
              </span>
              <span className="block mt-1.5 text-xs font-bold text-gray-800 uppercase tracking-wide">
                {stat.label}
              </span>
              <span className="block mt-0.5 text-[11px] text-gray-500">
                {stat.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Why Choose EBI
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Uncompromising Quality & Execution
          </h2>
          <p className="text-xs text-gray-500">
            We streamline complex tech, staffing, and support vectors so you can
            focus on scale.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-150 bg-white p-8 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                {benefit.icon}
              </div>
              <h3 className="font-display text-base font-semibold text-slate-900">
                {benefit.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-blue-950 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
              Fast-Track Pricing
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3.5xl">
              Need an Instant Corporate SLA Quote?
            </h2>
            <p className="text-xs text-blue-100 leading-relaxed">
              Register as an active client portal member in 30 seconds. Upload
              your technical documentation or scoping document, and our system
              will generate a custom quote proposal instantly.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("register")}
              className="rounded-xl bg-white text-blue-950 hover:bg-gray-100 px-6 py-3.5 text-xs font-bold transition shadow"
            >
              Become Portal Client
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 text-xs font-bold transition"
            >
              Explore Our Workflows
            </button>
          </div>
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Client Success Stories
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            What Our Partners Say
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col justify-between"
            >
              <p className="italic text-xs text-gray-600 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <span className="block text-xs font-bold text-slate-900">
                  {t.author}
                </span>
                <span className="block text-[10px] text-gray-500 uppercase font-semibold">
                  {t.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
