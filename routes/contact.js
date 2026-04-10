const express = require('express');
const router = express.Router();
const { createTransporter, adminEmail } = require('../utils/mailer');
const { escapeHtml, sanitizeSubject } = require('../utils/escapeHtml');

router.post('/', async (req, res) => {
  const { name, email, enquiry_type, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email and message are required.' });
  }

  try {
    const transporter = createTransporter();

    // Notify admin
    await transporter.sendMail({
      from: `"AsuraVerse Website" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      replyTo: email,
      subject: sanitizeSubject(`[Contact Us] ${enquiry_type || 'General Enquiry'} — ${name}`),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#090B10;color:#f0f0f0;padding:32px;border-radius:8px;">
          <h2 style="color:#FF7B00;margin-bottom:24px;">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#888;width:140px;">Name</td><td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#FF7B00;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Enquiry Type</td><td style="padding:8px 0;">${escapeHtml(enquiry_type || 'General Enquiry')}</td></tr>
            <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Message</td><td style="padding:8px 0;">${escapeHtml(message).replace(/\n/g, '<br>')}</td></tr>
          </table>
        </div>
      `
    });

    // Confirmation to sender
    await transporter.sendMail({
      from: `"Team AsuraVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We received your message — Team AsuraVerse',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#090B10;color:#f0f0f0;padding:32px;border-radius:8px;">
          <h2 style="color:#FF7B00;margin-bottom:16px;">Message Received!</h2>
          <p style="color:#aaa;line-height:1.7;">Hi ${escapeHtml(name)},</p>
          <p style="color:#aaa;line-height:1.7;">Thanks for reaching out to Team AsuraVerse! We've received your message and will get back to you as soon as possible.</p>
          <p style="color:#aaa;line-height:1.7;">In the meantime, follow us on <a href="https://www.instagram.com/teamasuraverse/" style="color:#FF7B00;">Instagram</a> for the latest updates.</p>
          <hr style="border-color:#333;margin:24px 0;">
          <p style="color:#555;font-size:13px;">Team AsuraVerse Esports Pvt Ltd · Gandhinagar, Gujarat, India</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
  }
});

module.exports = router;
