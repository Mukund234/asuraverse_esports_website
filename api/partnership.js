const nodemailer = require('nodemailer');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeSubject(str) {
  return String(str).replace(/[\r\n\t\x00-\x1f\x7f]/g, ' ').trim();
}

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });

  const { org_name, contact_name, email, phone, partnership_type, details } = req.body;

  if (!org_name || !contact_name || !email || !details) {
    return res.status(400).json({ success: false, error: 'Organisation name, contact name, email and details are required.' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  try {
    const transporter = createTransporter();

    // Notify admin
    await transporter.sendMail({
      from: `"AsuraVerse Website" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      replyTo: email,
      subject: sanitizeSubject(`[Partnership Inquiry] ${org_name} — ${partnership_type || 'General'}`),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#090B10;color:#f0f0f0;padding:32px;border-radius:8px;">
          <h2 style="color:#FF7B00;margin-bottom:24px;">New Partnership Inquiry</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#888;width:160px;">Organisation</td><td style="padding:8px 0;">${escapeHtml(org_name)}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Contact Name</td><td style="padding:8px 0;">${escapeHtml(contact_name)}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#FF7B00;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;">${escapeHtml(phone || '—')}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Partnership Type</td><td style="padding:8px 0;">${escapeHtml(partnership_type || 'General')}</td></tr>
            <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Details</td><td style="padding:8px 0;">${escapeHtml(details).replace(/\n/g, '<br>')}</td></tr>
          </table>
        </div>
      `
    });

    // Confirmation to sender
    await transporter.sendMail({
      from: `"Team AsuraVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Partnership Inquiry Received — Team AsuraVerse',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#090B10;color:#f0f0f0;padding:32px;border-radius:8px;">
          <h2 style="color:#FF7B00;margin-bottom:16px;">Partnership Inquiry Received!</h2>
          <p style="color:#aaa;line-height:1.7;">Hi ${escapeHtml(contact_name)},</p>
          <p style="color:#aaa;line-height:1.7;">Thank you for your interest in partnering with Team AsuraVerse! We've received your inquiry and our team will review it and get back to you within 2–3 business days.</p>
          <p style="color:#aaa;line-height:1.7;">We look forward to the possibility of working together to grow esports in India.</p>
          <hr style="border-color:#333;margin:24px 0;">
          <p style="color:#555;font-size:13px;">Team AsuraVerse Esports Pvt Ltd · Gandhinagar, Gujarat, India</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Your partnership inquiry has been submitted successfully!' });
  } catch (err) {
    console.error('Partnership form error:', err);
    res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
  }
}
