const User = require('../models/utilisateur');
const Token = require('../models/jwt_tokens');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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

            // Send welcome email
            await sendEmail({
                to: user.email,
                subject: 'Welcome to EBI Services – Account Created Successfully',
                html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
  <div style="background: #1e3a5f; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 20px;">EBI Services</h1>
  </div>
  <div style="padding: 20px; color: #374151;">
    <h2 style="color: #1e3a5f;">Welcome, ${user.fullname}!</h2>
    <p>Your account has been created successfully. You can now access your client portal to:</p>
    <ul>
      <li>Submit project requests and get quotes</li>
      <li>Book consultations with our team</li>
      <li>Track your documents and communications</li>
      <li>Chat with department managers</li>
    </ul>
    <p>If you have any questions, feel free to contact our support team.</p>
    <p style="margin-top: 20px;">Best regards,<br><strong>The EBI Services Team</strong></p>
  </div>
  <div style="background: #f9fafb; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #9ca3af;">
    &copy; ${new Date().getFullYear()} EBI Services. All rights reserved.
  </div>
</div>`
            });

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

// @desc    Forgot password – send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account with that email exists' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: 'EBI Services – Password Reset Request',
            html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
  <div style="background: #1e3a5f; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 20px;">EBI Services</h1>
  </div>
  <div style="padding: 20px; color: #374151;">
    <h2 style="color: #1e3a5f;">Password Reset Request</h2>
    <p>You requested a password reset. Click the button below to set a new password. This link expires in 30 minutes.</p>
    <div style="text-align: center; margin: 25px 0;">
      <a href="${resetUrl}" style="background: #1e3a5f; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
    </div>
    <p>If you did not request this, please ignore this email.</p>
    <p style="margin-top: 20px;">Best regards,<br><strong>The EBI Services Team</strong></p>
  </div>
  <div style="background: #f9fafb; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #9ca3af;">
    &copy; ${new Date().getFullYear()} EBI Services. All rights reserved.
  </div>
</div>`
        });

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
};
