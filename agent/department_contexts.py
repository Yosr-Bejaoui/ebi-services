GENERAL_BASE = """
====================================
EBI SERVICES – PRESENTATION GÉNÉRALE
====================================
Name: EBI Services | Nom: EBI Services
Slogan: "Votre Partenaire en Performance et Transformation"
Founded: Paris, France (8+ years)
CEO & Founder: Jean-Pierre Laurent
Industries: Custom Software, IT Recruitment, Back-Office & Call Center Outsourcing
Status: ISO 27001 Prepared

Core business: EBI Services delivers custom software ecosystems, IT technical
recruiting pipelines, and scalable back-office tele-services to enterprises
worldwide. The company provides solutions d'externalisation destinées aux
entreprises européennes.

Partner logos (homepage): Aura Fintech, Cyberdyne Systems, Carrefour France,
Innovatech Sourcing, Global Tele-Hub.

Key statistics:
- SLA Code Delivery: 98.7%
- Vetted Engineers: 450+
- Global Coverage: 24/7 (bilingual operators)
- Client Revenue Optimized: EUR15M+ (through custom ERPs)

Core benefits:
1) Rapid Execution & Integration – agile development, record-time delivery
2) Bank-Grade Technical Audits – compliance vetting, security audits
3) Elite Pre-Screened Talent – thorough candidate screenings

Gamme de services:
1) Tele-services
2) Business Process Outsourcing (BPO)
3) Solutions IT & Digitales
4) Sourcing & Integration de profils

Coordonnees de contact:
- Email: contact@ebiservices.net / servicesdossiers@gmail.com
- Email (contact page): contact@ebiservices.com
- Phone: +33 6 95 63 16 12 / +32 460 24 17 40 / +216 56 566 533
- Phone (contact page): +33 1 74 88 99 00
- Site web: www.ebiservices.net
- Siege social: 50 rue d'Algerie, 7000 Bizerte
- Headquarters: 12 Avenue des Champs-Elysees, Paris, France
- GPS: 48.8698° N, 2.3075° E
- Horaires: lundi au vendredi, 8h30-16h
- Working hours: 08:30 AM - 06:30 PM (CET), Monday to Friday
"""

DEPARTMENT_CONTEXTS = {
    "Tele-services": """
--------------------------------------------------------------
TELE-SERVICES / CALL CENTER & TELE-SERVICES
--------------------------------------------------------------
Bilingual: English & French
Coverage: 24/7 operations, 7 days a week

a) Gestion des appels entrants (Inbound Call Management)
   Reactif 7j/7 – 24h/24. Reponse aux demandes clients, assistance
   telephonique, SAV, gestion des reclamations, prise de messages,
   support technique.

b) Televente & prospection B2B / B2C (Outbound Sales)
   Campagnes de televente, prospection B2B/B2C, presentation d'offres,
   qualification de leads, closing des ventes, prise de RDV.

c) Prise de rendez-vous qualifies (Qualified Appointments)
   Qualification prospects, prise de RDV, gestion agendas, confirmation.

d) Téléscretariat & gestion d'agendas (Virtual Secretariat)
   Reception d'appels, gestion d'agendas, transmission de messages,
   suivi administratif, gestion emails.

e) Enquetes de satisfaction & fidelisation (Surveys & Retention)
   Enquetes satisfaction, analyse retours, campagnes fidelisation,
   suivi post-vente, reporting.

f) Saisie & Traitement de Donnees (Data Entry & Processing)
   Saisie administrative et comptable, mise a jour bases de donnees,
   numerisation et archivage, controle conformite. Outils: Excel, CRM, ERP.

g) Creation de Trafic & Generation de Leads (Traffic & Lead Gen)
   Campagnes multicanal: e-mailing, SMS, reseaux sociaux, SEO, SEA.
   Analyse du trafic et reporting.

SLA targets:
- Average Speed of Answer (ASA): < 90 seconds
- Daily ticket resolution rate: > 97%
- Weekly supervisor reports
""",

    "Business Process Outsourcing (BPO)": """
--------------------------------------------------------------
BUSINESS PROCESS OUTSOURCING (BPO)
--------------------------------------------------------------
Externalisation des processus metiers pour ameliorer l'efficacite
operationnelle, reduire les couts et gagner en agilite.

Services BPO:
- Externalisation de la relation client (Call Center & Teléservices)
- Gestion back-office et taches administratives
- Saisie et traitement de donnees
- Gestion des commandes et suivi clients
- Support technique (niveau 1)
- Assistance operationnelle sur mesure
- Conduite de travaux
""",

    "Solutions IT & Digitales": """
--------------------------------------------------------------
SOLUTIONS IT & DIGITALES / SOFTWARE DEVELOPMENT
--------------------------------------------------------------
Technologies: React 19, TypeScript, Tailwind CSS (frontend)
             RESTful APIs & Webhooks (backend)
             PostgreSQL & SQLite (databases)
Methodology: Agile / Scrum, 3-phase sprints

a) Services Managés (Managed IT Services)
   Gestion proactive des infrastructures: supervision continue,
   prevention et resolution proactive des incidents, securite,
   disponibilite, reduction des risques.

b) Services Web & Mobile (Web & Mobile Development)
   Conception et developpement de solutions web et mobiles sur mesure,
   performantes et evolutives. Applications modernes et securisees.

c) Developpement & Integration ERP (ERP Development)
   Conception et integration de progiciels ERP. Custom inventory mgmt,
   barcode/RFID scanners, logistics routing, automated resource planning.

Sprint phases:
- Phase 1: Requirements Scoping & Wireframes (3-5 days)
- Phase 2: Agile Code Sprint & DB Schemas (10-15 days)
- Phase 3: QA Vetting, Pen Testing & Delivery

Additional: Legacy Code Maintenance, code migration, security refactoring,
database indexing audits, continuous support with custom SLAs.
""",

    "Sourcing & Integration de profils": """
--------------------------------------------------------------
SOURCING & INTEGRATION DE PROFILS / IT RECRUITMENT & HR
--------------------------------------------------------------
Sectors: IT, Healthcare, High-Tech
Candidate pool: 450+ experienced developer candidates (active directory)

a) Sourcing (Talent Sourcing)
   Identify exceptional talents via expertise humaine and outils de
   recherche avances. Channels:
   - Reseaux professionnels (LinkedIn, GitHub)
   - CVtheques internationales
   - Chasse directe (executive search)
   - Reseau de partenaires
   Senior roles: frontend React experts, systems architects, TPMs.

b) Placement des profils (Candidate Placement)
   Comprehensive assessment: competences techniques, valeurs, potentiel.
   Pipeline: presélection, entretiens techniques, coordination
   candidats-entreprises, negociations contractuelles, suivi d'integration.

Pre-vetting: Algorithms Check, Reference Vetting, HR Compliance,
architectural whiteboard interviews.

Recruitment pipeline:
1. Talent Profiling & Job Board Matching
2. Pre-vetting: whiteboard & code testing
3. Candidate presentation with full reports
""",
}


def build_context(intent_result: dict) -> str:
    dept = intent_result.get("intent_fr") or intent_result.get("intent", "")
    specific = DEPARTMENT_CONTEXTS.get(dept, "")
    return f"{GENERAL_BASE}\n{specific}" if specific else GENERAL_BASE
