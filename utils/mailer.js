const nodemailer = require('nodemailer');

/**
 * Creates a Nodemailer transporter using Gmail SMTP credentials
 * stored in environment variables.
 */
function createTransporter() {
  // If email is not configured, return a mock transporter that just logs to console
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    return {
      sendMail: async (options) => {
        console.log('\n--- MOCK EMAIL SENT ---');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log('-----------------------\n');
        return true;
      }
    };
  }

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
