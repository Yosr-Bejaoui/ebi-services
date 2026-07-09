const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
            port: process.env.EMAIL_PORT || 2525,
            auth: {
                user: process.env.EMAIL_USER || 'user',
                pass: process.env.EMAIL_PASS || 'pass',
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@ebiservice.com',
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
};

module.exports = sendEmail;
