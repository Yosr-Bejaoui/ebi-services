const axios = require('axios');

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const data = {
            sender: {
                name: process.env.BREVO_SENDER_NAME || 'EBI Services',
                email: process.env.BREVO_SENDER_EMAIL || 'minyar1820@gmail.com',
            },
            to: [{ email: to }],
            subject,
        };
        if (html) {
            data.htmlContent = html;
        } else {
            data.textContent = text || subject;
        }
        const response = await axios({
            method: 'POST',
            url: 'https://api.brevo.com/v3/smtp/email',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
            },
            data,
        });
        console.log(`Email sent to ${to}: ${response.data.messageId}`);
        return true;
    } catch (error) {
        const detail = error.response?.data?.message || error.message;
        console.error(`Error sending email to ${to}: ${detail}`);
        return false;
    }
};

module.exports = sendEmail;
