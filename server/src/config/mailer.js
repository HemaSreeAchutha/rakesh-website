const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Drop-in replacement for the Nodemailer transporter.
 * Keeps the same sendMail({ to, subject, html, replyTo }) shape
 * so no controller needs changing.
 */
const transporter = {
  sendMail: async ({ to, subject, html, text, replyTo }) => {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo,
    });

    if (error) {
      throw new Error(error.message || "Email send failed");
    }

    return data;
  },
};

module.exports = transporter;