import React, { useState } from "react";
import {
  Laptop,
  Users2,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  AppWindow,
  Database,
  Hammer,
  Search,
  ShieldCheck,
  PhoneCall,
  FileClock,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

interface ServicesViewProps {
  setActiveTab: (tab: string) => void;
}

type ActiveDept = "development" | "recruitment" | "outsourcing";

export default function ServicesView({ setActiveTab }: ServicesViewProps) {
  const [activeDept, setActiveDept] = useState<ActiveDept>("development");

  const depts = [
    {
      id: "development",
      label: "Solutions Personnalisées",
      icon: <Laptop className="h-4 w-4" />,
    },
    {
      id: "recruitment",
      label: "Infrastructures IT",
      icon: <Users2 className="h-4 w-4" />,
    },
    {
      id: "outsourcing",
      label: "Performance Digitale",
      icon: <PhoneCall className="h-4 w-4" />,
    },
  ];

  const softwareServices = [
    {
      icon: <AppWindow className="h-6 w-6 text-blue-900" />,
      title: "Solutions sur mesure",
      desc: "Nous concevons des solutions technologiques adaptées à vos besoins spécifiques pour répondre à vos exigences de croissance.",
    },
    {
      icon: <Database className="h-6 w-6 text-blue-900" />,
      title: "Adaptabilité aux enjeux",
      desc: "Nos systèmes sont conçus pour s'adapter parfaitement à vos enjeux opérationnels et structurels.",
    },
    {
      icon: <Hammer className="h-6 w-6 text-blue-900" />,
      title: "Partenariats globaux",
      desc: "Nous accompagnons nos partenaires à travers plus de 5 pays avec des solutions robustes.",
    },
  ];

  const recruitmentServices = [
    {
      icon: <Search className="h-6 w-6 text-blue-900" />,
      title: "Optimisation des infrastructures",
      desc: "Nous améliorons vos infrastructures IT pour garantir une efficacité maximale de vos opérations.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-900" />,
      title: "Sécurité et protection",
      desc: "Nous mettons l'accent sur la sécurité de vos systèmes et la protection de vos données sensibles.",
    },
    {
      icon: <ClipboardList className="h-6 w-6 text-blue-900" />,
      title: "Gestion des environnements",
      desc: "Nous assurons une gestion rigoureuse de vos environnements informatiques pour prévenir les risques.",
    },
  ];

  const outsourcingServices = [
    {
      icon: <PhoneCall className="h-6 w-6 text-blue-900" />,
      title: "Amélioration des performances",
      desc: "Nous ciblons l'amélioration continue de vos performances digitales pour maximiser votre compétitivité.",
    },
    {
      icon: <FileClock className="h-6 w-6 text-blue-900" />,
      title: "Suivi opérationnel",
      desc: "Nous assurons un suivi constant de vos systèmes pour garantir des performances optimales à long terme.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-900" />,
      title: "Croissance soutenue",
      desc: "Nos solutions sont conçues pour accompagner votre croissance et évoluer avec vos ambitions.",
    },
  ];

  return (
    <div className="space-y-12 py-8">
      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto space-y-3 pt-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Nos départements
        </span>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 sm:text-5xl">
          Ce qu'EBI Services offre
        </h1>
        <p className="text-xs text-gray-400">
          Nous opérons sur trois vecteurs commerciaux principaux, entièrement synchronisés via le tableau de bord de notre portail client.
        </p>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center border-b border-gray-200">
          <div className="inline-flex space-x-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
            {depts.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveDept(dept.id as ActiveDept)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeDept === dept.id
                    ? "bg-blue-900 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                {dept.icon}
                <span>{dept.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {activeDept === "development" && (
          <div className="space-y-12 animate-fade-in">
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-blue-900">
                  Solutions Personnalisées
                </span>
                <h2 className="font-display text-2xl font-bold text-blue-950">
                  Des solutions adaptées à vos besoins
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Depuis plus de 8 ans, EBI Services accompagne ses partenaires avec des solutions conçues sur mesure pour répondre spécifiquement à leurs enjeux.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Sur mesure
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> Adaptabilité
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> +5 Pays
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {softwareServices.map((service, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-50">
                    {service.icon}
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-950">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeDept === "recruitment" && (
          <div className="space-y-12 animate-fade-in">
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-emerald-50/40 p-8 rounded-2xl border border-emerald-100">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-emerald-800">
                  Infrastructures IT
                </span>
                <h2 className="font-display text-2xl font-bold text-emerald-950">
                  Amélioration des infrastructures IT
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Nous mettons l'accent sur la sécurité et la robustesse de vos infrastructures IT. Nos solutions sont conçues pour assurer la pérennité et la fiabilité de vos opérations globales.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />{" "}
                    Sécurité
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />{" "}
                    Fiabilité
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Performance
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {recruitmentServices.map((service, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-emerald-50">
                    {service.icon}
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-950">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeDept === "outsourcing" && (
          <div className="space-y-12 animate-fade-in">
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-purple-50/40 p-8 rounded-2xl border border-purple-100">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-purple-800">
                  Performance Digitale
                </span>
                <h2 className="font-display text-2xl font-bold text-purple-950">
                  Amélioration continue des performances
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Nous nous engageons à améliorer continuellement les performances digitales de nos partenaires, en garantissant des résultats mesurables et durables pour répondre aux évolutions technologiques.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />{" "}
                    Amélioration continue
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />{" "}
                    Mesurabilité
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />{" "}
                    Opérations globales
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {outsourcingServices.map((service, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-purple-50">
                    {service.icon}
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-950">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <h3 className="font-display text-base font-bold text-slate-950">
            Définissons vos exigences opérationnelles
          </h3>
          <p className="text-xs text-gray-500">
            Réservez une consultation avec notre chef de département ou demandez instantanément un devis automatisé dans notre portail.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveTab("contact")}
              className="bg-blue-900 hover:bg-blue-950 text-white rounded-lg px-4 py-2.5 text-xs font-semibold shadow transition cursor-pointer"
            >
              Réserver une réunion de consultation
            </button>
            <button
              onClick={() => setActiveTab("portal")}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              Soumettre une demande de devis
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
