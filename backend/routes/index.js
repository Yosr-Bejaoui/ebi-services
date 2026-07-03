const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/client', require('./clientRoutes'));
router.use('/utilisateurs', require('./utilisateurRoutes'));
router.use('/demandes-devis', require('./demandeDeviRoutes'));
router.use('/devis', require('./deviRoutes'));
router.use('/documents', require('./documentRoutes'));
router.use('/messages', require('./messageRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/tokens', require('./tokenRoutes'));

module.exports = router;
