const Notification = require('../models/notification');

const getAll = async (req, res) => {
    try {
        const notifications = await Notification.find().populate('destinataire', '-password');
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id).populate('destinataire', '-password');
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notification', error: error.message });
    }
};

const getByDestinataire = async (req, res) => {
    try {
        const notifications = await Notification.find({ destinataire: req.params.destinataireId });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications by user', error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { destinataire, type, reference_id, contenu } = req.body;
        const notification = await Notification.create({ destinataire, type, reference_id, contenu });
        res.status(201).json({ message: 'Notification created', notification });
    } catch (error) {
        res.status(500).json({ message: 'Error creating notification', error: error.message });
    }
};

const markAsLu = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { $set: { lu: true } },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
};

const markAllAsLu = async (req, res) => {
    try {
        await Notification.updateMany(
            { destinataire: req.params.destinataireId, lu: false },
            { $set: { lu: true } }
        );
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notifications as read', error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notification', error: error.message });
    }
};

module.exports = { getAll, getById, getByDestinataire, create, markAsLu, markAllAsLu, delete: deleteNotification };
