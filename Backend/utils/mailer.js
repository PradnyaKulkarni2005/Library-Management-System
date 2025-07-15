
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.MAIL_USER, // Must match Gmail user
        to,
        subject,
        text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}. Message ID: ${info.messageId}`);
        
        if (info.accepted.includes(to)) {
            console.log("📬 Email was accepted by the mail server.");
            return true;
        } else {
            console.warn("⚠️ Email not accepted by the mail server.");
            return false;
        }
    } catch (err) {
        console.error(`❌ Failed to send email to ${to}:`, err.message || err);
        return false;
    }
};

module.exports = sendMail;
