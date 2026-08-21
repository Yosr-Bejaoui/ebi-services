import React from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
} from "lucide-react";
import logoImg from "../assets/logo.jpg";

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
              <img src={logoImg} alt="EBI Services" className="h-20 w-auto object-contain" />
            </div>
            <p className="text-xs leading-relaxed text-gray-500">
              Depuis plus de 8 ans, EBI Services accompagne ses partenaires à travers plus de 5 pays, en proposant des solutions adaptées à leurs besoins et à leurs enjeux.
            </p>
          </div>

          {}
          <div>
            <span className="block font-display text-xs font-semibold uppercase tracking-wider text-gray-900">
              Nos offres
            </span>
            <ul className="mt-4 space-y-2 text-xs">
              {[
                {
                  name: "Systèmes ERP et SaaS sur mesure",
                  action: () => {
                    setActiveTab("services");
                  },
                },
                {
                  name: "Applications web et mobiles",
                  action: () => {
                    setActiveTab("services");
                  },
                },
                {
                  name: "Recherche et sélection technique informatique",
                  action: () => {
                    setActiveTab("services");
                  },
                },
                {
                  name: "Support de centre d'appels bilingue",
                  action: () => {
                    setActiveTab("services");
                  },
                },
                {
                  name: "Back-office administratif",
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
              Accès entreprise
            </span>
            <ul className="mt-4 space-y-2 text-xs">
              {[
                {
                  name: "Portail client sécurisé",
                  action: () => {
                    setActiveTab("portal");
                  },
                },
                {
                  name: "Demander une réunion",
                  action: () => {
                    setActiveTab("contact");
                  },
                },
                {
                  name: "Obtenir un devis personnalisé",
                  action: () => {
                    setActiveTab("portal");
                  },
                },
                {
                  name: "Politique de confidentialité",
                  action: () => {
                    setActiveTab("privacy");
                  },
                },
                {
                  name: "Conditions d'utilisation",
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
              Contactez-nous
            </span>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-blue-900 flex-shrink-0" />
                <a href="tel:+21656566533" className="hover:text-blue-900 transition-colors">Tunisie : +216 56 566 533</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-blue-900 flex-shrink-0" />
                <a href="tel:+32460241740" className="hover:text-blue-900 transition-colors">Belgique : +32 460 24 17 40</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-blue-900 flex-shrink-0" />
                <a href="mailto:servicesdossiers@gmail.com" className="hover:text-blue-900 transition-colors">servicesdossiers@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} EBI Services. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
