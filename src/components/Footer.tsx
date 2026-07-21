import React from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
} from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-900 text-white">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-display text-base font-bold text-blue-950">
                EBI Services
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              Elite custom software development, world-class IT recruitment, and
              secure administrative tele-services & customer support. Operating
              worldwide with custom SLAs.
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-100 w-fit">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Secure Platform</span>
            </div>
          </div>

          {}
          <div>
            <span className="block font-display text-xs font-semibold uppercase tracking-wider text-gray-900">
              Our Offerings
            </span>
            <ul className="mt-4 space-y-2 text-xs">
              {[
                {
                  name: "Custom ERP & SaaS Systems",
                  action: () => {
                    setActiveTab("services");
                  },
                },
                {
                  name: "Web & Mobile Applications",
                  action: () => {
                    setActiveTab("services");
                  },
                },
                {
                  name: "IT Technical Sourcing & Screening",
                  action: () => {
                    setActiveTab("services");
                  },
                },
                {
                  name: "Bilingual Call Center Support",
                  action: () => {
                    setActiveTab("services");
                  },
                },
                {
                  name: "Administrative Back Office",
                  action: () => {
                    setActiveTab("services");
                  },
                },
              ].map((item, index) => (
                <li key={index}>
                  <button
                    onClick={item.action}
                    className="hover:text-blue-900 transition-colors cursor-pointer"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div>
            <span className="block font-display text-xs font-semibold uppercase tracking-wider text-gray-900">
              Corporate Access
            </span>
            <ul className="mt-4 space-y-2 text-xs">
              {[
                {
                  name: "Secure Client Portal",
                  action: () => {
                    setActiveTab("portal");
                  },
                },
                {
                  name: "Request Meeting",
                  action: () => {
                    setActiveTab("contact");
                  },
                },
                {
                  name: "Get Custom Quotation",
                  action: () => {
                    setActiveTab("portal");
                  },
                },
                {
                  name: "Privacy Policy",
                  action: () => {
                    setActiveTab("privacy");
                  },
                },
                {
                  name: "Terms of Use",
                  action: () => {
                    setActiveTab("terms");
                  },
                },
              ].map((item, index) => (
                <li key={index}>
                  <button
                    onClick={item.action}
                    className="hover:text-blue-900 transition-colors cursor-pointer text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {}
          <div className="space-y-3">
            <span className="block font-display text-xs font-semibold uppercase tracking-wider text-gray-900">
              Headquarters
            </span>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-center space-x-2">
                <MapPin className="h-3.5 w-3.5 text-blue-900 flex-shrink-0" />
                <span>12 Avenue des Champs-Élysées, Paris, France</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-blue-900 flex-shrink-0" />
                <span>+33 1 74 88 99 00</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-blue-900 flex-shrink-0" />
                <span>contact@ebiservices.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="h-3.5 w-3.5 text-blue-900 flex-shrink-0" />
                <span>www.ebiservices.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} EBI Services. All rights reserved.
            Registered SaaS Platform. Developed for Premium Operations.
          </p>
        </div>
      </div>
    </footer>
  );
}
