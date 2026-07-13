// ============================================================
// EBI Services Demo Data Seeder
// Paste this into the browser console while on the portal page
// ============================================================
(function() {
  const DB_PREFIX = 'ebi_db_';
  const now = new Date().toISOString();

  function getStore(key, def) {
    try {
      return JSON.parse(localStorage.getItem(DB_PREFIX + key) || JSON.stringify(def));
    } catch { return def; }
  }
  function setStore(key, val) {
    localStorage.setItem(DB_PREFIX + key, JSON.stringify(val));
  }

  // Get current user from the React app
  const appRoot = document.getElementById('root');
  if (!appRoot) return console.error('Root element not found');

  // Try to get user info from localStorage session
  let userId = '', userName = '', userEmail = '';
  try {
    const users = getStore('users', []);
    const token = localStorage.getItem('ebi_session_token');
    // Find the user by checking if they're logged in
    const current = users.find(u => u.id === localStorage.getItem('ebi_session_userId'));
    if (current) {
      userId = current.id;
      userName = current.name;
      userEmail = current.email;
    } else if (users.length > 0) {
      // Use first non-admin user
      const client = users.find(u => u.role === 'client');
      if (client) {
        userId = client.id;
        userName = client.name;
        userEmail = client.email;
      }
    }
  } catch { /* ignore */ }

  if (!userId) return console.error('No user found. Log in first.');

  const seedId = 'seed-' + Date.now();
  let counter = 0;
  const id = (p) => p + '-' + seedId + '-' + (++counter);

  const daysFromNow = (d) => {
    const dt = new Date(); dt.setDate(dt.getDate() + d);
    return dt.toISOString().split('T')[0];
  };

  // Clear previous seed data
  ['quoteRequests', 'quotes', 'appointments', 'notifications'].forEach(k => {
    const items = getStore(k, []).filter(i => !i.id.startsWith('seed-'));
    setStore(k, items);
  });

  // ---- Quote Requests ----
  const projects = [
    { company: 'Carrefour Logistics', industry: 'Logistics', projectType: 'Custom ERP System', budget: '€25,000 - €50,000', deadline: '6 Months', requirements: 'Full ERP integration with inventory management, barcode scanning, and automated resource planning.', status: 'quoted' },
    { company: 'SanteCorp France', industry: 'Healthcare', projectType: 'Mobile App Development', budget: '€10,000 - €25,000', deadline: '3 Months', requirements: 'Cross-platform mobile application for patient appointment scheduling and tele-consultation.', status: 'quoted' },
    { company: 'Telecom Global SA', industry: 'Telecommunications', projectType: 'Call Center Setup', budget: '€50,000 - €100,000', deadline: '4 Months', requirements: 'Turnkey bilingual call center setup with CRM integration, IVR system, and agent dashboard.', status: 'quoted' },
    { company: 'Nexus Technologies', industry: 'Technology', projectType: 'IT Recruitment Pipeline', budget: '€5,000 - €10,000', deadline: '2 Months', requirements: 'Technical sourcing and pre-vetting pipeline for 10 senior React and Node.js developers.', status: 'in_review' },
    { company: 'BNP Finance Group', industry: 'Finance', projectType: 'Data Analytics Platform', budget: '€25,000 - €50,000', deadline: '5 Months', requirements: 'Custom BI dashboard with real-time data visualization, KPI tracking, and automated reporting.', status: 'new' },
    { company: 'Modex E-commerce', industry: 'E-commerce', projectType: 'Website Redesign', budget: '€10,000 - €25,000', deadline: '2 Months', requirements: 'Modern responsive website redesign with CMS integration, SEO optimization, and multilingual support.', status: 'new' },
  ];

  const createdReqs = [];
  projects.forEach((p, i) => {
    const req = { id: id('qr'), userId, clientName: userName, ...p, createdAt: now };
    const list = getStore('quoteRequests', []);
    list.push(req);
    setStore('quoteRequests', list);
    createdReqs.push(req);
  });

  // ---- Quotes ----
  const quotesData = [
    { projectName: 'Custom ERP System', amount: 42500, terms: 'Net 30. 30% advance on approval, 40% on Beta delivery, 30% on completion. Includes 6 months free SLA maintenance support.' },
    { projectName: 'Mobile App Development', amount: 18500, terms: 'Net 15. 50% upfront, 50% on delivery. 3 months post-launch support included.' },
    { projectName: 'Call Center Setup', amount: 78500, terms: 'Net 45. Phased payments across 4 milestones. Includes 12 months of 24/7 infrastructure monitoring.' },
  ];

  quotesData.forEach((q, i) => {
    if (createdReqs[i]) {
      const quote = {
        id: id('q'), quoteRequestId: createdReqs[i].id,
        clientName: userName, ...q,
        expiryDate: daysFromNow(30), status: 'sent', createdAt: now,
      };
      const list = getStore('quotes', []);
      list.push(quote);
      setStore('quotes', list);

      // Mark the linked request as quoted
      const reqs = getStore('quoteRequests', []);
      const found = reqs.find(r => r.id === createdReqs[i].id);
      if (found) found.status = 'quoted';
      setStore('quoteRequests', reqs);
    }
  });

  // ---- Appointments ----
  const aptsData = [
    { title: 'ERP Requirements Discovery', timeSlot: '10:00 - 11:00', status: 'confirmed' },
    { title: 'Mobile App Architecture Review', timeSlot: '14:00 - 15:30', status: 'pending' },
    { title: 'Call Center Infrastructure Audit', timeSlot: '09:00 - 10:30', status: 'pending' },
    { title: 'Technical Screening Setup', timeSlot: '15:00 - 16:00', status: 'confirmed' },
    { title: 'BI Dashboard Prototype Demo', timeSlot: '11:00 - 12:00', status: 'pending' },
  ];

  aptsData.forEach((a, i) => {
    const apt = {
      id: id('apt'), userId, clientName: userName, clientEmail: userEmail,
      date: daysFromNow((i + 1) * 7), timezone: 'Europe/Paris',
      ...a, createdAt: now,
    };
    const list = getStore('appointments', []);
    list.push(apt);
    setStore('appointments', list);
  });

  // ---- Notifications ----
  const notifsData = [
    { title: 'Welcome to EBI Services Portal', message: 'Your client portal is now active. Explore your dashboard to submit project requests, track quotes, and book consultations.', read: false },
    { title: 'Quote Ready for Review', message: 'A formal SLA pricing proposal has been generated for your ERP project. View and respond in the Quotations section.', read: false },
    { title: 'Consultation Confirmed', message: 'Your project discovery meeting has been confirmed for the coming week. Check the Consultations tab for details.', read: false },
    { title: 'Document Upload Received', message: 'Your uploaded project specification document has been received and attached to your scoping request.', read: true },
    { title: 'SLA Milestone Update', message: 'Your software development SLA milestone schedule is now available for review in the Quotations section.', read: false },
  ];

  notifsData.forEach(n => {
    const notif = { id: id('notif'), userId, ...n, createdAt: now };
    const list = getStore('notifications', []);
    list.push(notif);
    setStore('notifications', list);
  });

  // ---- Activity Logs ----
  const logs = getStore('logs', []);
  logs.push({ id: id('log'), userId, userName, action: 'Demo data seeded: quote requests, quotes, appointments, and notifications', timestamp: now });
  logs.push({ id: id('log'), userId, userName, action: 'Portal dashboard initialized with sample project data', timestamp: now });
  setStore('logs', logs);

  console.log('Demo data seeded successfully!');
  console.log(`  ${projects.length} quote requests`);
  console.log(`  ${quotesData.length} quotes (with accept/reject buttons)`);
  console.log(`  ${aptsData.length} appointments`);
  console.log(`  ${notifsData.length} notifications`);
  console.log('Refresh the page to see the changes in your portal dashboard.');
  console.log('The "Accept & Sign SLA" and "Reject Quote" buttons are now functional.');
})();
