const express = require('express');
const router = express.Router();
const { createAppointment, getAppointmentsByUser, cancelAppointment } = require('../controllers/appointmentController');

router.post('/', createAppointment);
router.get('/user/:userId', getAppointmentsByUser);
router.patch('/:id/cancel', cancelAppointment);

module.exports = router;
