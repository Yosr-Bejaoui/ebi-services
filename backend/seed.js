require('dotenv').config();
const mongoose = require('mongoose');
const Utilisateur = require('./models/utilisateur');
const Service = require('./models/service');
const DemandeDevis = require('./models/demandeDevi');
const Devis = require('./models/devi');
const Document = require('./models/document');
const Message = require('./models/message');
const Notification = require('./models/notification');
const Token = require('./models/jwt_tokens');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            Utilisateur.deleteMany(),
            Service.deleteMany(),
            DemandeDevis.deleteMany(),
            Devis.deleteMany(),
            Document.deleteMany(),
            Message.deleteMany(),
            Notification.deleteMany(),
            Token.deleteMany(),
        ]);
        console.log('Cleared existing data');

        // ───── Users (plain passwords — the pre('save') hook hashes them) ─────
        const users = await Utilisateur.create([
            { fullname: 'Admin EBI', email: 'admin@ebi-services.com', telephone: 3312345678, password: 'password123', entreprise: 'EBI Services', role: 'admin' },
            { fullname: 'Sophie Martin', email: 'sophie.martin@example.com', telephone: 33611223344, password: 'password123', entreprise: 'Martin SARL', role: 'client' },
            { fullname: 'Pierre Durant', email: 'pierre.durant@example.com', telephone: 33655667788, password: 'password123', entreprise: 'Durant & Fils', role: 'client' },
            { fullname: 'Visiteur Test', email: 'visitor@example.com', telephone: 3377889900, password: 'password123', role: 'visitor' },
            { fullname: 'Jean Dupont', email: 'jean.dupont@admin.com', telephone: 33112233445, password: 'password123', entreprise: 'EBI Services', role: 'admin' },
        ]);
        const [admin, client1, client2, visitor, admin2] = users;
        console.log(`Created ${users.length} users`);

        // ───── Services ─────
        const services = await Service.create([
            { nom: 'Audit énergétique', description: 'Diagnostic complet de la performance énergétique du bâtiment' },
            { nom: 'Installation panneaux solaires', description: 'Étude et installation de panneaux photovoltaïques' },
            { nom: 'Isolation thermique', description: 'Isolation des combles, murs et planchers' },
            { nom: 'Chaudière biomasse', description: 'Installation et entretien de chaudières à biomasse' },
        ]);
        console.log(`Created ${services.length} services`);

        // ───── Demandes de devis ─────
        const demandes = await DemandeDevis.create([
            { client: client1._id, service: services[0]._id, manager: admin._id, besoin: 'Je souhaite un audit complet pour mon immeuble de bureaux de 500m2', statut: 'en_cours' },
            { client: client1._id, service: services[2]._id, besoin: 'Devis pour isolation des combles d\'une maison de 120m2', statut: 'en_attente' },
            { client: client2._id, service: services[1]._id, manager: admin._id, besoin: 'Installation de 20 panneaux solaires sur toiture industrielle', statut: 'devis_envoye' },
            { client: client2._id, service: services[3]._id, manager: admin2._id, besoin: 'Remplacement chaudière fioul par biomasse', statut: 'accepte' },
        ]);
        console.log(`Created ${demandes.length} demandes de devis`);

        // ───── Devis ─────
        const devis = await Devis.create([
            { demande: demandes[0]._id, fichier_pdf: 'https://storage.ebi-services.com/devis/audit-001.pdf', montant: 3500, statut: 'envoye' },
            { demande: demandes[2]._id, fichier_pdf: 'https://storage.ebi-services.com/devis/solaire-002.pdf', montant: 18500, statut: 'envoye' },
            { demande: demandes[3]._id, fichier_pdf: 'https://storage.ebi-services.com/devis/biomasse-003.pdf', montant: 12000, statut: 'telecharge', date_telechargement: new Date() },
        ]);
        console.log(`Created ${devis.length} devis`);

        // ───── Documents ─────
        const docs = await Document.create([
            { client: client1._id, demande: demandes[0]._id, nom_fichier: 'facture_elec_2025.pdf', lien: 'https://storage.ebi-services.com/docs/facture-elec.pdf', uploaded_by: client1._id, origine: 'client', taille: 204800, type_mime: 'application/pdf' },
            { client: client1._id, demande: demandes[0]._id, nom_fichier: 'plan_batiment.dwg', lien: 'https://storage.ebi-services.com/docs/plan-batiment.dwg', uploaded_by: admin._id, origine: 'admin', taille: 5120000, type_mime: 'application/dwg' },
            { client: client2._id, demande: demandes[2]._id, nom_fichier: 'photos_toiture.zip', lien: 'https://storage.ebi-services.com/docs/photos-toiture.zip', uploaded_by: client2._id, origine: 'client', taille: 15728640, type_mime: 'application/zip' },
        ]);
        console.log(`Created ${docs.length} documents`);

        // ───── Messages ─────
        const messages = await Message.create([
            { client: client1._id, expediteur: client1._id, contenu: 'Bonjour, pourriez-vous me donner plus de détails sur l\'audit énergétique ?', lu: true },
            { client: client1._id, expediteur: admin._id, contenu: 'Bonjour Sophie, bien sûr. Notre audit inclut une visite technique, une analyse des factures et un rapport détaillé.', lu: true },
            { client: client1._id, expediteur: client1._id, contenu: 'Parfait, merci ! Pouvez-vous inclure un chiffrage des travaux recommandés ?', lu: false },
            { client: client2._id, expediteur: admin._id, contenu: 'Bonjour Pierre, nous avons bien reçu votre demande. Un technicien vous contactera sous 48h.', lu: true },
        ]);
        console.log(`Created ${messages.length} messages`);

        // ───── Notifications ─────
        const notifications = await Notification.create([
            { destinataire: client1._id, type: 'nouveau_message', reference_id: messages[0]._id, contenu: 'Nouveau message de votre conseiller EBI', lu: true },
            { destinataire: client1._id, type: 'statut_demande', reference_id: demandes[0]._id, contenu: 'Votre demande #1 est en cours de traitement', lu: false },
            { destinataire: client2._id, type: 'nouveau_devis', reference_id: devis[0]._id, contenu: 'Votre devis pour l\'installation solaire est disponible', lu: false },
            { destinataire: client2._id, type: 'nouveau_document', reference_id: docs[2]._id, contenu: 'Nouveau document partagé par EBI Services', lu: false },
        ]);
        console.log(`Created ${notifications.length} notifications`);

        // ───── JWT Tokens ─────
        const future = new Date();
        future.setFullYear(future.getFullYear() + 1);
        await Token.create([
            { utilisateur: client1._id, access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIno', refresh_token: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4=', date_expiration: future, actif: true },
            { utilisateur: admin._id, access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiJ9', refresh_token: 'cmVmcmVzaCB0b2tlbiBmb3IgYWRtaW4=', date_expiration: future, actif: true },
        ]);
        console.log('Created 2 tokens');

        console.log('\n✓ Seed completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seed();
