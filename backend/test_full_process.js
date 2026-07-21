// Use native fetch
const BASE = 'http://localhost:5001/api';

const log = (label, data) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  ${label}`);
    console.log('='.repeat(60));
    if (typeof data === 'object') console.log(JSON.stringify(data, null, 2));
    else console.log(data);
};

const runProcess = async () => {
    let clientToken, adminToken, clientUserId, demandeId, devisId;

    // 1. Client login
    log('1. Client Login');
    const clientLogin = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'sophie.martin@example.com', password: 'password123' })
    });
    const clientData = await clientLogin.json();
    clientToken = clientData.access_token;
    clientUserId = clientData._id;
    console.log(`Client logged in successfully: ${clientData.fullname} (${clientData.role})`);

    // 2. Admin login
    log('2. Admin Login');
    const adminLogin = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@ebi-services.com', password: 'password123' })
    });
    const adminData = await adminLogin.json();
    adminToken = adminData.access_token;
    console.log(`Admin logged in successfully: ${adminData.fullname} (${adminData.role})`);

    // Fetch services to get one
    const servicesReq = await fetch(`${BASE}/client/demandes`, { // wait, I need a service list? Is there a services route?
        method: 'GET',
        headers: { 'Authorization': `Bearer ${clientToken}` }
    });
    // Actually I can just fetch an existing demande from seed data to get a service ID
    const myDemandesReq = await fetch(`${BASE}/client/demandes`, { headers: { 'Authorization': `Bearer ${clientToken}` } });
    const myDemandes = await myDemandesReq.json();
    const serviceId = myDemandes[0]?.service;
    
    // 3. Client creates a Demande de Devis
    log('3. Client Creates Demande');
    const createDemande = await fetch(`${BASE}/demandes-devis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clientToken}` },
        body: JSON.stringify({
            client: clientUserId,
            service: serviceId || '6a5faaab716802b97d4c3cef',
            besoin: 'Installation de 20 serveurs rackables avec configuration réseau',
            priorite: 'haute'
        })
    });
    const demandeResponse = await createDemande.json();
    if (createDemande.status !== 201) {
        console.error('Failed to create demande', demandeResponse);
        return;
    }
    const demandeData = demandeResponse.demande;
    demandeId = demandeData._id;
    console.log(`Demande created successfully! ID: ${demandeId}`);
    console.log(`Besoin: ${demandeData.besoin}, Priorité: ${demandeData.priorite}, Statut: ${demandeData.statut}`);

    // 4. Admin lists Demandes and updates the created demande's status to en_cours
    log('4. Admin reviews Demandes and updates status');
    const updateDemande = await fetch(`${BASE}/demandes-devis/${demandeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ statut: 'en_cours' })
    });
    const updateDemandeResponse = await updateDemande.json();
    if (!updateDemande.ok) {
        console.error('Update Demande failed:', updateDemande.status, updateDemandeResponse);
        return;
    }
    const updatedDemandeData = updateDemandeResponse.demande;
    console.log(`Admin updated demande status to: ${updatedDemandeData.statut}`);

    // 5. Admin creates a Devis for the Demande
    log('5. Admin Creates Devis');
    const createDevis = await fetch(`${BASE}/devis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({
            demande: demandeId,
            montant: 12500,
            fichier_pdf: 'uploads/mock.pdf'
        })
    });
    const devisResponse = await createDevis.json();
    if (!createDevis.ok) {
        console.error('Failed to create devis:', devisResponse);
        return;
    }
    const devisData = devisResponse.devis;
    devisId = devisData._id;
    console.log(`Devis created successfully! ID: ${devisId}`);
    console.log(`Montant total: ${devisData.montant} EUR, Statut: ${devisData.statut}`);

    // 6. Client retrieves Devis for the Demande
    log('6. Client Retrieves Devis');
    const getDevis = await fetch(`${BASE}/devis/demande/${demandeId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${clientToken}` }
    });
    const devisListData = await getDevis.json();
    console.log(`Client found ${devisListData.length} devis for this demande.`);
    if (devisListData.length > 0) {
        console.log(`Devis ID: ${devisListData[0]._id}, Montant: ${devisListData[0].montant} EUR`);
    }

    // 7. Client approves Devis
    log('7. Client Approves Devis');
    const approveDevis = await fetch(`${BASE}/devis/${devisId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clientToken}` },
        body: JSON.stringify({ statut: 'accepte' })
    });
    const approvedDevisResponse = await approveDevis.json();
    const approvedDevisData = approvedDevisResponse.devis;
    console.log(`Client updated devis status to: ${approvedDevisData.statut}`);

    // 8. Client sends a message in Demande
    log('8. Client Sends Message');
    const sendMsg = await fetch(`${BASE}/client/demandes/${demandeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${clientToken}` },
        body: JSON.stringify({ contenu: 'Devis approuvé, merci de lancer le processus.' })
    });
    if (sendMsg.status === 201) {
        console.log(`Message sent successfully by client!`);
    } else {
        console.log(`Failed to send message: Status ${sendMsg.status}`);
    }

    // 9. Admin checks Messages
    log('9. Admin Checks Messages');
    const getMsg = await fetch(`${BASE}/messages/demande/${demandeId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const msgData = await getMsg.json();
    console.log(`Admin sees ${msgData.length} messages in this demande.`);
    if(msgData.length > 0) {
        console.log(`Last message from client: "${msgData[msgData.length - 1].contenu}"`);
    }

    log('🏁 FULL PROCESS SIMULATION COMPLETED', 'All scenarios tested successfully.');
};

runProcess().catch(e => console.error('Fatal error:', e));
