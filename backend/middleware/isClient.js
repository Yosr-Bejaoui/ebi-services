const isClient = (req, res, next) => {
    if (req.user && req.user.role === 'client') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. You must be a client.' });
    }
};

module.exports = isClient;
