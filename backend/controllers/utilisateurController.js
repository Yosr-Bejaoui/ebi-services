const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/utilisateur');

const getUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find().select('-password');
        res.status(200).json(utilisateurs);
    } catch (error) {
        console.log(`error while fetching users: ${error.message}`);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

const getUtilisateurById = async (req, res) => {
    try {
        const user = await Utilisateur.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.log(`error while fetching user: ${error.message}`);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

const getUtilisateursByRole = async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find({ role: req.params.role }).select('-password');
        res.status(200).json(utilisateurs);
    } catch (error) {
        console.log(`error while fetching users by role: ${error.message}`);
        res.status(500).json({ message: 'Error fetching users by role', error: error.message });
    }
};

const createUtilisateur = async (req, res) => {
    try {
        const { fullname, email, telephone, password, entreprise, role } = req.body;
        const existing = await Utilisateur.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already in use' });

        const user = await Utilisateur.create({ fullname, email, telephone, password, entreprise, role });
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json({ message: 'User created', user: userObj });
    } catch (error) {
        console.log(`error while creating user: ${error.message}`);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

const updateUtilisateur = async (req, res) => {
    try {
        const forbidden = ['id', '_id', 'createdAt', 'role'];
        const updates = { ...req.body };
        forbidden.forEach(f => delete updates[f]);

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await Utilisateur.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User updated', user });
    } catch (error) {
        console.log(`error while updating user: ${error.message}`);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

const deleteUtilisateur = async (req, res) => {
    try {
        const user = await Utilisateur.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        console.log(`error while deleting user: ${error.message}`);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

module.exports = {
    getUtilisateurs,
    getUtilisateurById,
    getUtilisateursByRole,
    createUtilisateur,
    updateUtilisateur,
    deleteUtilisateur,
};
