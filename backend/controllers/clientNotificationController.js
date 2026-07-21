const Notification = require('../models/notification');

// @desc    Get all notifications for the client
// @route   GET /api/client/notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ destinataire: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark a specific notification as read
// @route   PATCH /api/client/notifications/:id/read
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, destinataire: req.user._id },
            { lu: true },
            { returnDocument: 'after' }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark all notifications as read for the client
// @route   PATCH /api/client/notifications/read-all
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { destinataire: req.user._id, lu: false },
            { lu: true }
        );

        res.status(200).json({ message: 'Toutes les notifications ont été marquées comme lues' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
