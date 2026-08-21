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
    { value: "+8 Ans", label: "D'expérience", desc: "Sur le marché international" },
    { value: "+5", label: "Pays", desc: "Partenaires à travers le monde" },
    { value: "100%", label: "Personnalisé", desc: "Des solutions sur mesure" },
    { value: "Max", label: "Performance", desc: "Amélioration digitale" },
  ];

  const benefits = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      title: "Performance Digitale",
      desc: "Nous mettons l'accent sur l'amélioration continue des performances digitales de votre entreprise pour répondre à vos exigences.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
      title: "Sécurité",
      desc: "La protection de vos données et la sécurité de votre infrastructure IT sont au cœur de nos solutions technologiques.",
    },
    {
      icon: <Award className="h-6 w-6 text-blue-600" />,
      title: "Solutions Personnalisées",
      desc: "Nous proposons des solutions spécifiquement adaptées à vos besoins et à vos enjeux opérationnels.",
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 max-w-3xl mx-auto pt-8">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-900 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Amélioration des infrastructures IT</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-none">
            Faites évoluer vos performances digitales avec{" "}
            <span className="text-blue-900">EBI Services</span>
          </h1>

          <p className="text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Nous proposons des solutions adaptées à vos besoins et à vos enjeux, en mettant l'accent sur la performance, la sécurité et l'amélioration continue.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab("contact")}
              className="w-full sm:w-auto rounded-xl bg-blue-900 hover:bg-blue-950 text-white px-6 py-3.5 text-xs font-bold shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Planifier une consultation</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3.5 text-xs font-bold shadow-sm transition"
            >
              Devenir membre du portail client
            </button>
            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-6 py-3.5 text-xs font-bold transition flex items-center justify-center space-x-1.5"
            >
              <MessageSquareCode className="h-4 w-4" />
              <span>Parler avec le conseil IA</span>
            </button>
          </div>
        </div>
      </section>

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

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Pourquoi choisir EBI
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Performance et Sécurité
          </h2>
          <p className="text-xs text-gray-500">
            Nous accompagnons nos partenaires avec des solutions adaptées pour l'amélioration continue de leurs performances digitales.
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

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-blue-950 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
              Tarification accélérée
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3.5xl">
              Besoin d'un devis d'entreprise SLA instantané ?
            </h2>
            <p className="text-xs text-blue-100 leading-relaxed">
              Inscrivez-vous en tant que membre actif du portail client en 30 secondes. Téléchargez votre documentation technique ou votre document de cadrage, et notre système générera instantanément une proposition de devis personnalisé.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("register")}
              className="rounded-xl bg-white text-blue-950 hover:bg-gray-100 px-6 py-3.5 text-xs font-bold transition shadow"
            >
              Devenir client du portail
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 text-xs font-bold transition"
            >
              Explorer nos flux de travail
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
