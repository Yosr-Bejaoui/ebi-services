const User = require('../models/utilisateur');
const Token = require('../models/jwt_tokens');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate Access and Refresh Tokens
const generateTokens = async (userId) => {
    const access_token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '1h',
    });
    
    const refresh_token = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', {
        expiresIn: '7d',
    });

    const date_expiration = new Date();
    date_expiration.setHours(date_expiration.getHours() + 1);

    // Save tokens in database
    await Token.create({
        utilisateur: userId,
        access_token,
        refresh_token,
        date_expiration,
        actif: true
    });

    return { access_token, refresh_token };
};

// @desc    Register new user (client by default)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        if (!global.__dbConnected) {
            return res.status(503).json({
                message: 'Registration unavailable because the database is currently unreachable.',
                error: 'DB_UNAVAILABLE'
            });
        }

        const { fullname, email, telephone, password, entreprise } = req.body;

        if (!fullname || !email || !telephone || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            fullname,
            email,
            telephone,
            password,
            entreprise,
            role: 'client' // Default to client as discussed
        });

        if (user) {
            const tokens = await generateTokens(user._id);
            res.status(201).json({
                _id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                ...tokens
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!global.__dbConnected) {
            return res.status(503).json({
                message: 'Authentication unavailable because the database is currently unreachable.',
                error: 'DB_UNAVAILABLE'
            });
        }

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const tokens = await generateTokens(user._id);
            res.json({
                _id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                ...tokens
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        // req.user is set in authMiddleware
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getMe,
};
