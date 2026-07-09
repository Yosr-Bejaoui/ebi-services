const DemandeDevis = require('../models/demandeDevi');
const Message = require('../models/message');
const Document = require('../models/document');
const Devis = require('../models/devi');
require('../models/service'); // For populate
require('../models/utilisateur'); // For populate
const sendEmail = require('../utils/sendEmail');
const path = require('path');
const fs = require('fs');

// @desc    Get all requests for the logged-in client
// @route   GET /api/client/demandes
const getMesDemandes = async (req, res) => {
    try {
        // Exclude internal notes from the results sent to client
        const demandes = await DemandeDevis.find({ client: req.user._id })
            .select('-notes') 
            .populate('service');
        res.status(200).json(demandes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get details of a specific request
// @route   GET /api/client/demandes/:id
const getDemandeDetail = async (req, res) => {
    try {
        const demande = await DemandeDevis.findOne({ _id: req.params.id, client: req.user._id })
            .select('-notes')
            .populate('service');
            
        if (!demande) {
            return res.status(404).json({ message: 'Demande non trouvée ou accès non autorisé' });
        }
        res.status(200).json(demande);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get messages for a specific request
// @route   GET /api/client/demandes/:id/messages
const getMessages = async (req, res) => {
    try {
        const demande = await DemandeDevis.findOne({ _id: req.params.id, client: req.user._id });
        if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });

        // Assuming messages are tied to the client and we can filter by client. 
        // Note: The message model doesn't explicitly link to 'demande' in your schema, 
        // but normally it should. I'll fetch messages where client is the current user.
        // If your system needs messages tied to a specific demande, the Message schema 
        // might need a 'demande' field. Assuming 'client' is the only link for now.
        const messages = await Message.find({ client: req.user._id })
            .populate('expediteur', 'fullname role');
            
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Send a message regarding a request
// @route   POST /api/client/demandes/:id/messages
const sendMessage = async (req, res) => {
    try {
        const { contenu } = req.body;
        
        const demande = await DemandeDevis.findOne({ _id: req.params.id, client: req.user._id }).populate('manager');
        if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });

        if (!contenu) return res.status(400).json({ message: 'Le contenu du message est requis' });

        const message = await Message.create({
            client: req.user._id,
            expediteur: req.user._id,
            contenu
        });

        // Notify manager if assigned
        if (demande.manager) {
            await sendEmail({
                to: demande.manager.email,
                subject: `Nouveau message du client pour la demande ${demande._id}`,
                text: `Le client a envoyé un nouveau message : ${contenu}`
            });
        }

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get full history (messages, documents, devis) for a request
// @route   GET /api/client/demandes/:id/historique
const getHistorique = async (req, res) => {
    try {
        const demandeId = req.params.id;
        const clientId = req.user._id;

        const demande = await DemandeDevis.findOne({ _id: demandeId, client: clientId });
        if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });

        const messages = await Message.find({ client: clientId }).lean();
        const documents = await Document.find({ demande: demandeId, client: clientId }).lean();
        const devis = await Devis.find({ demande: demandeId }).lean();

        // Add a type flag to each item for frontend sorting/display
        const histMessages = messages.map(m => ({ ...m, type: 'message', date: m.createdAt }));
        const histDocuments = documents.map(d => ({ ...d, type: 'document', date: d.createdAt }));
        const histDevis = devis.map(d => ({ ...d, type: 'devis', date: d.createdAt }));

        const historique = [...histMessages, ...histDocuments, ...histDevis]
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        res.status(200).json(historique);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Download PDF of a Devis
// @route   GET /api/client/devis/:id/download
const downloadDevis = async (req, res) => {
    try {
        // Find devis and populate demande to check ownership
        const devis = await Devis.findById(req.params.id).populate('demande');
        
        if (!devis || !devis.demande || devis.demande.client.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Devis non trouvé ou non autorisé' });
        }

        const filePath = path.resolve(devis.fichier_pdf);
        if (fs.existsSync(filePath)) {
            // Update status to downloaded
            if (devis.statut === 'envoye') {
                devis.statut = 'telecharge';
                devis.date_telechargement = new Date();
                await devis.save();
            }
            res.download(filePath);
        } else {
            res.status(404).json({ message: 'Fichier PDF non trouvé sur le serveur' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getMesDemandes,
    getDemandeDetail,
    getMessages,
    sendMessage,
    getHistorique,
    downloadDevis
};
