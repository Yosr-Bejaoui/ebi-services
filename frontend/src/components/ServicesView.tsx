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
      label: "Software Development",
      icon: <Laptop className="h-4 w-4" />,
    },
    {
      id: "recruitment",
      label: "IT Recruitment & HR",
      icon: <Users2 className="h-4 w-4" />,
    },
    {
      id: "outsourcing",
      label: "Tele-Services & Support",
      icon: <PhoneCall className="h-4 w-4" />,
    },
  ];

  const softwareServices = [
    {
      icon: <AppWindow className="h-6 w-6 text-blue-900" />,
      title: "Web Applications",
      desc: "Premium, responsive, high-performance customer-facing SaaS systems and web modules engineered using React 19, TypeScript, and Tailwind CSS.",
    },
    {
      icon: <Database className="h-6 w-6 text-blue-900" />,
      title: "Enterprise Resource Planning (ERP)",
      desc: "Custom inventory management systems, barcode/RFID scanners, logistics routing models, and automated resource planning pipelines.",
    },
    {
      icon: <Hammer className="h-6 w-6 text-blue-900" />,
      title: "Legacy Code Maintenance",
      desc: "Comprehensive code migration, security refactoring, database indexing audits, and continuous active support with custom SLAs.",
    },
  ];

  const recruitmentServices = [
    {
      icon: <Search className="h-6 w-6 text-blue-900" />,
      title: "IT Talent Sourcing",
      desc: "Active sourcing of senior engineering candidates, frontend React experts, systems architects, and technical product managers.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-900" />,
      title: "Rigorous Screening Vetting",
      desc: "Comprehensive pre-vetting including algorithm coding checks, architectural whiteboard interviews, and thorough references vetting.",
    },
    {
      icon: <ClipboardList className="h-6 w-6 text-blue-900" />,
      title: "Candidate HR Matching",
      desc: "End-to-end recruitment pipelines, interview scheduling, administrative contracts management, and standard payroll support.",
    },
  ];

  const outsourcingServices = [
    {
      icon: <PhoneCall className="h-6 w-6 text-blue-900" />,
      title: "Customer Support Call Center",
      desc: "High-end, 24/7 bilingual (English & French) support desks, outbound leads follow-up, inbound helpdesks, and customer satisfaction logs.",
    },
    {
      icon: <FileClock className="h-6 w-6 text-blue-900" />,
      title: "Administrative Back Office",
      desc: "Secured data entry, PDF reports compiling, compliance document handling, email sorting, and calendar bookings optimization.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-900" />,
      title: "Lead Generation support",
      desc: "Targeted outbound tele-campaigns, qualification surveys, company database validation, and CRM integration workflows.",
    },
  ];

  return (
    <div className="space-y-12 py-8">
      {}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto space-y-3 pt-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Our Departments
        </span>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 sm:text-5xl">
          What EBI Services Delivers
        </h1>
        <p className="text-xs text-gray-400">
          We operate across three core business vectors, fully synchronized via
          our Client Portal dashboard.
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
                  Department Overview
                </span>
                <h2 className="font-display text-2xl font-bold text-blue-950">
                  Agile Custom Software Development
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Our software division builds robust, responsive web platforms
                  and custom database ERPs. We utilize a rigid agile cycle:
                  complete specifications scoping, rapid visual prototyping,
                  sandbox development, unit testing, and secure TLS deployments.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-900" /> React
                    & TypeScript
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-900" />{" "}
                    RESTful APIs & Webhooks
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-900" />{" "}
                    PostgreSQL & SQLite
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-blue-900 p-6 text-white space-y-3">
                <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                  Service Workflow Sprints
                </span>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-300">Phase 1:</span>{" "}
                    Requirements Scoping & Wireframes (3-5 days)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-300">Phase 2:</span>{" "}
                    Agile Code Sprint & DB Schemas (10-15 days)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-300">Phase 3:</span> QA
                    Vetting, Pen Testing & Delivery
                  </li>
                </ul>
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
                  Department Overview
                </span>
                <h2 className="font-display text-2xl font-bold text-emerald-950">
                  Technical IT Recruitment & HR
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We specialize in sourcing and pre-vetting high-level tech
                  resources. We maintain an active directory of 450+ experienced
                  developer candidates, running deep candidate screening
                  protocols to ensure only qualified developers are delivered to
                  your pipeline.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />{" "}
                    Algorithms Check
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />{" "}
                    Reference Vetting
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> HR
                    Compliance
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-slate-900 p-6 text-white space-y-3">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  IT Recruitment Pipeline
                </span>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-400">Step 1:</span>{" "}
                    Talent Profiling & Job Board Matching
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-400">Step 2:</span>{" "}
                    Pre-vetting whiteboard & code testing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-400">Step 3:</span>{" "}
                    Candidate presentation with full reports
                  </li>
                </ul>
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
                  Department Overview
                </span>
                <h2 className="font-display text-2xl font-bold text-purple-950">
                  24/7 Back-Office & Call Support
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Outsource your call support, administrative back office, and
                  inbound helpdesk systems to EBI. Our operators are fully
                  bilingual (English and French), structured under active
                  managers with rigid response latency SLAs.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />{" "}
                    Bilingual En/Fr
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />{" "}
                    Ticketing Support
                  </span>
                  <span className="bg-white border border-gray-200 text-slate-800 text-[10px] px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />{" "}
                    24/7 Operations
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-purple-950 p-6 text-white space-y-3">
                <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">
                  SLA Performance Indicators
                </span>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-300">Target 1:</span>{" "}
                    Average Response Latency &lt; 90 seconds
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-300">Target 2:</span>{" "}
                    Daily ticket resolution rate &gt; 97%
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-300">Target 3:</span>{" "}
                    Full supervisor reporting logs weekly
                  </li>
                </ul>
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
            Let's Frame Your Operational Requirements
          </h3>
          <p className="text-xs text-gray-500">
            Book a consultation calendar event with our department head or
            request an automated quote instantly in our Portal.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveTab("contact")}
              className="bg-blue-900 hover:bg-blue-950 text-white rounded-lg px-4 py-2.5 text-xs font-semibold shadow transition cursor-pointer"
            >
              Book Consultation Meeting
            </button>
            <button
              onClick={() => setActiveTab("portal")}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              Submit Quote Request
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
