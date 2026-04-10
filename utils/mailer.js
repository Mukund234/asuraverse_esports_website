const nodemailer = require('nodemailer');

/**
 * Creates a Nodemailer transporter using Gmail SMTP credentials
 * stored in environment variables.
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

module.exports = { createTransporter, adminEmail };
