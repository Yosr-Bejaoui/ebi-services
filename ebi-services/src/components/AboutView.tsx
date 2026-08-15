import React from "react";
import {
  ShieldCheck,
  Target,
  HeartHandshake,
  Eye,
  Briefcase,
  Award,
} from "lucide-react";

export default function AboutView() {
  const values = [
    {
      icon: <Target className="h-5 w-5 text-blue-900" />,
      title: "Performance",
      desc: "Nous concevons des opérations hautement performantes pour répondre à vos exigences de croissance.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-blue-900" />,
      title: "Sécurité",
      desc: "Nous accordons une priorité absolue à la sécurisation des systèmes et à la protection de l'infrastructure informatique.",
    },
    {
      icon: <HeartHandshake className="h-5 w-5 text-blue-900" />,
      title: "Solutions personnalisées",
      desc: "Nous accompagnons nos partenaires à travers plus de 5 pays avec des solutions adaptées à leurs besoins et à leurs enjeux.",
    },
    {
      icon: <Eye className="h-5 w-5 text-blue-900" />,
      title: "Amélioration continue",
      desc: "Nous assurons une amélioration continue des performances digitales pour garantir votre résilience opérationnelle.",
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Aperçu de l'entreprise
          </span>
          <h1 className="font-display text-4xl font-extrabold text-slate-900 sm:text-5.5xl leading-none">
            EBI Services
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Depuis plus de 8 ans, EBI Services accompagne ses partenaires à travers plus de 5 pays, en proposant des solutions adaptées à leurs besoins et à leurs enjeux. L'entreprise met l'accent sur la performance, la sécurité, les solutions personnalisées et l'amélioration continue des performances digitales.
          </p>
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display text-2.5xl font-bold text-slate-900">
            Nos piliers fondamentaux
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Les valeurs qui guident les opérations quotidiennes et les SLA mondiaux d'EBI Services.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {values.map((v, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                {v.icon}
              </div>
              <h3 className="font-display text-base font-semibold text-slate-900">
                {v.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-left">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Orienté Solutions
            </span>
            <h2 className="font-display text-2.5xl font-bold text-slate-900">
              Des solutions personnalisées pour vos enjeux
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              EBI Services est dédiée à l'amélioration de vos infrastructures IT et à la performance digitale. Depuis plus de 8 ans sur le marché, nous bâtissons des relations de confiance avec des partenaires dans plus de 5 pays à travers le monde.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                <Briefcase className="h-4 w-4 text-blue-900" />
                <span>+8 Ans d'Expérience</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                <Target className="h-4 w-4 text-blue-900" />
                <span>Solutions personnalisées</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-tr from-blue-950 to-blue-900 p-8 text-white space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold">Notre vision</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              "L'entreprise met l'accent sur la performance, la sécurité, les solutions personnalisées et l'amélioration continue des performances digitales."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
