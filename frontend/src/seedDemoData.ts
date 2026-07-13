import { clientDb } from "./clientDb";
import { Appointment, Quote, QuoteRequest, Notification } from "./types";

const SEED_PROJECTS: Array<Omit<QuoteRequest, "id" | "createdAt">> = [
    { userId: "", clientName: "", company: "Carrefour Logistics", industry: "Logistics", projectType: "Custom ERP System", budget: "€25,000 - €50,000", deadline: "6 Months", requirements: "Full ERP integration with inventory management, barcode scanning, and automated resource planning.", status: "quoted" },
    { userId: "", clientName: "", company: "SanteCorp France", industry: "Healthcare", projectType: "Mobile App Development", budget: "€10,000 - €25,000", deadline: "3 Months", requirements: "Cross-platform mobile application for patient appointment scheduling and tele-consultation.", status: "quoted" },
    { userId: "", clientName: "", company: "Telecom Global SA", industry: "Telecommunications", projectType: "Call Center Setup", budget: "€50,000 - €100,000", deadline: "4 Months", requirements: "Turnkey bilingual call center setup with CRM integration, IVR system, and agent dashboard.", status: "quoted" },
    { userId: "", clientName: "", company: "Nexus Technologies", industry: "Technology", projectType: "IT Recruitment Pipeline", budget: "€5,000 - €10,000", deadline: "2 Months", requirements: "Technical sourcing and pre-vetting pipeline for 10 senior React and Node.js developers.", status: "new" },
    { userId: "", clientName: "", company: "BNP Finance Group", industry: "Finance", projectType: "Data Analytics Platform", budget: "€25,000 - €50,000", deadline: "5 Months", requirements: "Custom BI dashboard with real-time data visualization, KPI tracking, and automated reporting.", status: "in_review" },
    { userId: "", clientName: "", company: "Modex E-commerce", industry: "E-commerce", projectType: "Website Redesign", budget: "€10,000 - €25,000", deadline: "2 Months", requirements: "Modern responsive website redesign with CMS integration, SEO optimization, and multilingual support.", status: "new" },
];

const SEED_QUOTES: Array<Omit<Quote, "id" | "createdAt">> = [
    { quoteRequestId: "", clientName: "", projectName: "Custom ERP System", amount: 42500, terms: "Net 30. 30% advance on approval, 40% on Beta delivery, 30% on completion. Includes 6 months free SLA maintenance support.", expiryDate: "", status: "sent" },
    { quoteRequestId: "", clientName: "", projectName: "Mobile App Development", amount: 18500, terms: "Net 15. 50% upfront, 50% on delivery. 3 months post-launch support included.", expiryDate: "", status: "sent" },
    { quoteRequestId: "", clientName: "", projectName: "Call Center Setup", amount: 78500, terms: "Net 45. Phased payments across 4 milestones. Includes 12 months of 24/7 infrastructure monitoring.", expiryDate: "", status: "sent" },
];

const SEED_APPOINTMENTS: Array<Omit<Appointment, "id" | "createdAt">> = [
    { userId: "", clientName: "", clientEmail: "", title: "ERP Requirements Discovery", date: "", timeSlot: "10:00 - 11:00", timezone: "Europe/Paris", status: "confirmed" },
    { userId: "", clientName: "", clientEmail: "", title: "Mobile App Architecture Review", date: "", timeSlot: "14:00 - 15:30", timezone: "Europe/Paris", status: "pending" },
    { userId: "", clientName: "", clientEmail: "", title: "Call Center Infrastructure Audit", date: "", timeSlot: "09:00 - 10:30", timezone: "Europe/Paris", status: "pending" },
    { userId: "", clientName: "", clientEmail: "", title: "Technical Screening Setup", date: "", timeSlot: "15:00 - 16:00", timezone: "Europe/Paris", status: "confirmed" },
    { userId: "", clientName: "", clientEmail: "", title: "BI Dashboard Prototype Demo", date: "", timeSlot: "11:00 - 12:00", timezone: "Europe/Paris", status: "pending" },
];

const SEED_NOTIFICATIONS: Array<Omit<Notification, "id" | "createdAt">> = [
    { userId: "", title: "Welcome to EBI Services Portal", message: "Your client portal is now active. Explore your dashboard to submit project requests, track quotes, and book consultations.", read: false },
    { userId: "", title: "Quote Ready for Review", message: "A formal SLA pricing proposal has been generated for your ERP project. View and respond in the Quotations section.", read: false },
    { userId: "", title: "Consultation Confirmed", message: "Your project discovery meeting has been confirmed for the coming week. Check the Consultations tab for details.", read: false },
    { userId: "", title: "Document Upload Received", message: "Your uploaded project specification document has been received and attached to your scoping request.", read: true },
    { userId: "", title: "SLA Milestone Update", message: "Your software development SLA milestone schedule is now available for review in the Quotations section.", read: false },
];

const BASE_ID = "seed";
let idCounter = 0;
function nextId(prefix: string): string {
    return `${prefix}-${BASE_ID}-${Date.now()}-${++idCounter}`;
}

function addDays(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
}

function dateStr(): string {
    return new Date().toISOString();
}

export function seedDemoData(userId: string, userName: string, userEmail: string): void {
    idCounter = 0;

    // Seed quote requests
    const existingReqs = clientDb.getQuoteRequests().filter(r => r.id.startsWith("seed-"));
    if (existingReqs.length > 0) {
        console.log(`Demo data already exists (${existingReqs.length} requests). Clearing first...`);
        const remaining = clientDb.getQuoteRequests().filter(r => !r.id.startsWith("seed-"));
        clientDb.setQuoteRequests(remaining);

        const remainingQuotes = clientDb.getQuotes().filter(q => !q.id.startsWith("seed-"));
        clientDb.setQuotes(remainingQuotes);

        const remainingApts = clientDb.getAppointments().filter(a => !a.id.startsWith("seed-"));
        clientDb.setAppointments(remainingApts);

        const remainingNotifs = clientDb.getNotifications().filter(n => !n.id.startsWith("seed-"));
        clientDb.setNotifications(remainingNotifs);
    }

    // Map projects to quote requests
    const createdReqs: { req: QuoteRequest; index: number }[] = [];
    SEED_PROJECTS.forEach((p, i) => {
        const req: QuoteRequest = {
            id: nextId("qr"),
            userId,
            clientName: userName,
            ...p,
            createdAt: dateStr(),
        };
        const list = clientDb.getQuoteRequests();
        list.push(req);
        clientDb.setQuoteRequests(list);
        createdReqs.push({ req, index: i });
    });
    console.log(`Seeded ${createdReqs.length} quote requests`);

    // Seed quotes
    SEED_QUOTES.forEach((q, i) => {
        if (createdReqs[i]) {
            const quote: Quote = {
                id: nextId("q"),
                ...q,
                quoteRequestId: createdReqs[i].req.id,
                clientName: userName,
                expiryDate: addDays(30),
                createdAt: dateStr(),
            };
            const list = clientDb.getQuotes();
            list.push(quote);
            clientDb.setQuotes(list);

            // Mark the linked request as "quoted"
            const reqs = clientDb.getQuoteRequests();
            const found = reqs.find(r => r.id === createdReqs[i].req.id);
            if (found) found.status = "quoted";
            clientDb.setQuoteRequests(reqs);
        }
    });
    console.log(`Seeded ${SEED_QUOTES.length} quotes`);

    // Seed appointments
    const now = new Date();
    SEED_APPOINTMENTS.forEach((a, i) => {
        const apt: Appointment = {
            id: nextId("apt"),
            ...a,
            userId,
            clientName: userName,
            clientEmail: userEmail,
            date: addDays((i + 1) * 7),
            createdAt: dateStr(),
        };
        const list = clientDb.getAppointments();
        list.push(apt);
        clientDb.setAppointments(list);
    });
    console.log(`Seeded ${SEED_APPOINTMENTS.length} appointments`);

    // Seed notifications
    SEED_NOTIFICATIONS.forEach((n) => {
        const notif: Notification = {
            id: nextId("notif"),
            ...n,
            userId,
            createdAt: dateStr(),
        };
        const list = clientDb.getNotifications();
        list.push(notif);
        clientDb.setNotifications(list);
    });
    console.log(`Seeded ${SEED_NOTIFICATIONS.length} notifications`);

    // Add activity logs
    clientDb.addActivityLog(userId, userName, "Demo data seeded: quote requests, quotes, appointments, and notifications");
    clientDb.addActivityLog(userId, userName, "Portal dashboard initialized with sample project data");

    console.log("Demo data seeded successfully! Refresh the portal view to see changes.");
}
