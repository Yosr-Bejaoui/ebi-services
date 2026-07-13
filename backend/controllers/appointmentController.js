const Appointment = require('../models/appointment');
const sendEmail = require('../utils/sendEmail');

exports.createAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);

        await sendEmail({
            to: appointment.clientEmail,
            subject: 'EBI Services – Consultation Booking Confirmed',
            html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
  <div style="background: #1e3a5f; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 20px;">EBI Services</h1>
  </div>
  <div style="padding: 20px; color: #374151;">
    <h2 style="color: #1e3a5f;">Consultation Booked Successfully</h2>
    <p>Hello <strong>${appointment.clientName}</strong>,</p>
    <p>Your consultation has been booked. Here are the details:</p>
    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
      <p><strong>Objective:</strong> ${appointment.title}</p>
      <p><strong>Date:</strong> ${appointment.date}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot}</p>
      <p><strong>Timezone:</strong> ${appointment.timezone}</p>
      <p><strong>Status:</strong> Pending confirmation</p>
    </div>
    <p>Our team will confirm your appointment shortly. You can track all your consultations in your client portal.</p>
    <p style="margin-top: 20px;">Best regards,<br><strong>The EBI Services Team</strong></p>
  </div>
  <div style="background: #f9fafb; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #9ca3af;">
    &copy; ${new Date().getFullYear()} EBI Services. All rights reserved.
  </div>
</div>`
        });

        res.status(201).json(appointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAppointmentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const appointments = await Appointment.find({ userId }).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
