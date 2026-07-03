const Token = require('../models/jwt_tokens');

const getAll = async (req, res) => {
    try {
        const tokens = await Token.find().populate('utilisateur', '-password');
        res.status(200).json(tokens);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tokens', error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const token = await Token.findById(req.params.id).populate('utilisateur', '-password');
        if (!token) return res.status(404).json({ message: 'Token not found' });
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching token', error: error.message });
    }
};

const getByUtilisateur = async (req, res) => {
    try {
        const tokens = await Token.find({ utilisateur: req.params.utilisateurId, actif: true });
        res.status(200).json(tokens);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tokens for user', error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { utilisateur, access_token, refresh_token, date_expiration } = req.body;
        const token = await Token.create({ utilisateur, access_token, refresh_token, date_expiration });
        res.status(201).json({ message: 'Token created', token });
    } catch (error) {
        res.status(500).json({ message: 'Error creating token', error: error.message });
    }
};

const revoke = async (req, res) => {
    try {
        const token = await Token.findByIdAndUpdate(
            req.params.id,
            { $set: { actif: false } },
            { new: true }
        );
        if (!token) return res.status(404).json({ message: 'Token not found' });
        res.status(200).json({ message: 'Token revoked', token });
    } catch (error) {
        res.status(500).json({ message: 'Error revoking token', error: error.message });
    }
};

const deleteToken = async (req, res) => {
    try {
        const token = await Token.findByIdAndDelete(req.params.id);
        if (!token) return res.status(404).json({ message: 'Token not found' });
        res.status(200).json({ message: 'Token deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting token', error: error.message });
    }
};

module.exports = { getAll, getById, getByUtilisateur, create, revoke, delete: deleteToken };
