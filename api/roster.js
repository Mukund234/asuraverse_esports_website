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

  const { player_name, ign, email, phone, game, role, experience } = req.body;

  if (!player_name || !ign || !email || !game) {
    return res.status(400).json({ success: false, error: 'Player name, IGN, email and game preference are required.' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  try {
    const transporter = createTransporter();

    // Notify admin
    await transporter.sendMail({
      from: `"AsuraVerse Website" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      replyTo: email,
      subject: sanitizeSubject(`[Roster Application] ${player_name} — ${game}`),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#090B10;color:#f0f0f0;padding:32px;border-radius:8px;">
          <h2 style="color:#FF7B00;margin-bottom:24px;">New Roster Application</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#888;width:160px;">Player Name</td><td style="padding:8px 0;">${escapeHtml(player_name)}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">IGN</td><td style="padding:8px 0;">${escapeHtml(ign)}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#FF7B00;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;">${escapeHtml(phone || '—')}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Game</td><td style="padding:8px 0;">${escapeHtml(game)}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Role</td><td style="padding:8px 0;">${escapeHtml(role || '—')}</td></tr>
            <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Experience</td><td style="padding:8px 0;">${escapeHtml(experience || '—').replace(/\n/g, '<br>')}</td></tr>
          </table>
        </div>
      `
    });

    // Confirmation to applicant
    await transporter.sendMail({
      from: `"Team AsuraVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Roster Application Received — Team AsuraVerse',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#090B10;color:#f0f0f0;padding:32px;border-radius:8px;">
          <h2 style="color:#FF7B00;margin-bottom:16px;">Application Received!</h2>
          <p style="color:#aaa;line-height:1.7;">Hi ${escapeHtml(player_name)},</p>
          <p style="color:#aaa;line-height:1.7;">Your roster application for <strong style="color:#FF7B00;">${escapeHtml(game)}</strong> has been received. Our coaching staff will review your application and reach out if you are shortlisted for trials.</p>
          <p style="color:#aaa;line-height:1.7;">Keep practising and stay sharp — the grind never stops!</p>
          <hr style="border-color:#333;margin:24px 0;">
          <p style="color:#555;font-size:13px;">Team AsuraVerse Esports Pvt Ltd · Gandhinagar, Gujarat, India</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Your roster application has been submitted successfully!' });
  } catch (err) {
    console.error('Roster form error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit application. Please try again later.' });
  }
}
