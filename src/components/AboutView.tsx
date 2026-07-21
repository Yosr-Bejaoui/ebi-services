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
      icon: <ShieldCheck className="h-5 w-5 text-blue-900" />,
      title: "Security & Compliance",
      desc: "All client data, contracts, and systems comply with strict European frameworks. We prioritize system containment and complete cybersecurity auditing.",
    },
    {
      icon: <Target className="h-5 w-5 text-blue-900" />,
      title: "Agile Delivery Systems",
      desc: "We employ rapid iteration paradigms. Clients gain direct live portal tracking of our software sprints, recruiting funnels, and support latency stats.",
    },
    {
      icon: <HeartHandshake className="h-5 w-5 text-blue-900" />,
      title: "Absolute Professionalism",
      desc: "From bilingual call agents to expert systems engineers, EBI delegates elite human assets pre-vetted via extensive screening protocols.",
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Company Overview
          </span>
          <h1 className="font-display text-4xl font-extrabold text-slate-900 sm:text-5.5xl leading-none">
            Elite Corporate Support & Custom Software Engineering
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Founded in Paris, EBI Services delivers custom software ecosystems,
            IT technical recruiting pipelines, and scalable back-office
            tele-services to enterprises worldwide.
          </p>
        </div>
      </section>

      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display text-2.5xl font-bold text-slate-900">
            Our Core Pillars
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            The values driving EBI Services' daily operations and global SLAs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
              Global Leadership
            </span>
            <h2 className="font-display text-2.5xl font-bold text-slate-900">
              We Architect Operations So You Can Focus on Innovation
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our multidisciplinary approach breaks down standard barriers
              between software, recruitment, and customer operations. We provide
              a single, unified client portal that aggregates all service
              quotes, scheduling calendars, documents, and secure team chats
              into a seamless dashboard.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                <Briefcase className="h-4 w-4 text-blue-900" />
                <span>3 Core Departments</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700">
                <Award className="h-4 w-4 text-blue-900" />
                <span>ISO 27001 Prepared</span>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-tr from-blue-950 to-blue-900 p-8 text-white space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold">Our Vision</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              "To remain the absolute gold standard for corporate operations,
              software delegation, and recruitment outsourcing. We aim to
              combine high-performance software systems with premium human
              assets, creating absolute operational resilience for our
              clientele."
            </p>
            <div className="pt-2">
              <span className="block text-xs font-bold">
                Jean-Pierre Laurent
              </span>
              <span className="block text-[10px] text-blue-300">
                CEO & Founder, EBI Services
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
