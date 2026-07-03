const Document = require('../models/document');

const getAll = async (req, res) => {
    try {
        const docs = await Document.find()
            .populate('client', '-password')
            .populate('demande')
            .populate('uploaded_by', '-password');
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents', error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id)
            .populate('client', '-password')
            .populate('demande')
            .populate('uploaded_by', '-password');
        if (!doc) return res.status(404).json({ message: 'Document not found' });
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching document', error: error.message });
    }
};

const getByClient = async (req, res) => {
    try {
        const docs = await Document.find({ client: req.params.clientId })
            .populate('demande')
            .populate('uploaded_by', '-password');
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents by client', error: error.message });
    }
};

const getByDemande = async (req, res) => {
    try {
        const docs = await Document.find({ demande: req.params.demandeId })
            .populate('client', '-password')
            .populate('uploaded_by', '-password');
        res.status(200).json(docs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching documents by demande', error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const doc = await Document.create(req.body);
        res.status(201).json({ message: 'Document created', doc });
    } catch (error) {
        res.status(500).json({ message: 'Error creating document', error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const doc = await Document.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!doc) return res.status(404).json({ message: 'Document not found' });
        res.status(200).json({ message: 'Document updated', doc });
    } catch (error) {
        res.status(500).json({ message: 'Error updating document', error: error.message });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const doc = await Document.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });
        res.status(200).json({ message: 'Document deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting document', error: error.message });
    }
};

module.exports = { getAll, getById, getByClient, getByDemande, create, update, delete: deleteDocument };
