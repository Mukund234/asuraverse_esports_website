const express = require('express');
const router = express.Router();
const { createTransporter, adminEmail } = require('../utils/mailer');
const { escapeHtml, sanitizeSubject } = require('../utils/escapeHtml');

const roleLabels = {
  player:  'Player Application',
  creator: 'Content Creator Application',
  manager: 'Team Manager Application',
  analyst: 'Analyst / Coach Application'
};

router.post('/', async (req, res) => {
  const { player_name, ign, email, phone, game, player_role, platform, channel_url, tools, experience, role } = req.body;

  if (!player_name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  const roleLabel = roleLabels[role] || 'General Application';

  try {
    const transporter = createTransporter();

    // Build role-specific extra rows
    let extraRows = '';
    if (role === 'player') {
      extraRows += `<tr><td style="padding:8px 0;color:#888;width:160px;">Game</td><td style="padding:8px 0;">${escapeHtml(game || '—')}</td></tr>`;
      extraRows += `<tr><td style="padding:8px 0;color:#888;">In-Game Role</td><td style="padding:8px 0;">${escapeHtml(player_role || '—')}</td></tr>`;
    }
    if (role === 'creator') {
      extraRows += `<tr><td style="padding:8px 0;color:#888;width:160px;">Platform</td><td style="padding:8px 0;">${escapeHtml(platform || '—')}</td></tr>`;
      extraRows += `<tr><td style="padding:8px 0;color:#888;">Channel URL</td><td style="padding:8px 0;"><a href="${escapeHtml(channel_url || '#')}" style="color:#FF7B00;">${escapeHtml(channel_url || '—')}</a></td></tr>`;
    }
    if (role === 'analyst') {
      extraRows += `<tr><td style="padding:8px 0;color:#888;width:160px;">Tools Used</td><td style="padding:8px 0;">${escapeHtml(tools || '—')}</td></tr>`;
    }

    // Notify admin
    await transporter.sendMail({
      from: `"AsuraVerse Website" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      replyTo: email,
      subject: sanitizeSubject(`[${roleLabel}] ${player_name} — ${ign || 'No IGN'}`),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#090B10;color:#f0f0f0;padding:32px;border-radius:8px;">
          <h2 style="color:#FF7B00;margin-bottom:4px;">New ${roleLabel}</h2>
          <p style="color:#666;font-size:13px;margin-bottom:24px;">Received via asuraverse.in/opportunities</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#888;width:160px;">Name</td><td style="padding:8px 0;">${escapeHtml(player_name)}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">IGN / Handle</td><td style="padding:8px 0;">${escapeHtml(ign || '—')}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#FF7B00;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888;">Phone</td><td style="padding:8px 0;">${escapeHtml(phone || '—')}</td></tr>
            <tr><td style="padding:8px 0;color:#888;">Role Applied</td><td style="padding:8px 0;"><strong style="color:#FF7B00;">${escapeHtml(roleLabel)}</strong></td></tr>
            ${extraRows}
            <tr><td style="padding:8px 0;color:#888;vertical-align:top;">Background</td><td style="padding:8px 0;">${escapeHtml(experience || '—').replace(/\n/g, '<br>')}</td></tr>
          </table>
        </div>
      `
    });

    // Confirmation to applicant
    await transporter.sendMail({
      from: `"Team AsuraVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${roleLabel} Received — Team AsuraVerse`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#090B10;color:#f0f0f0;padding:32px;border-radius:8px;">
          <h2 style="color:#FF7B00;margin-bottom:16px;">Application Received!</h2>
          <p style="color:#aaa;line-height:1.7;">Hi ${escapeHtml(player_name)},</p>
          <p style="color:#aaa;line-height:1.7;">Your <strong style="color:#FF7B00;">${escapeHtml(roleLabel)}</strong> has been received by the AsuraVerse team. We review every application personally and will get back to you within <strong>3–5 business days</strong>.</p>
          <p style="color:#aaa;line-height:1.7;">In the meantime, follow our journey on social media:</p>
          <p style="margin-top:16px;">
            <a href="https://www.instagram.com/teamasuraverse/" style="color:#FF7B00;margin-right:16px;">Instagram</a>
            <a href="https://www.youtube.com/@TeamAsuraVerse" style="color:#FF7B00;margin-right:16px;">YouTube</a>
            <a href="https://x.com/asuraversegg" style="color:#FF7B00;">X / Twitter</a>
          </p>
          <hr style="border-color:#333;margin:24px 0;">
          <p style="color:#555;font-size:13px;">Team AsuraVerse Esports Pvt Ltd · Gandhinagar, Gujarat, India · asuraverse.in</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Your application has been submitted successfully!' });
  } catch (err) {
    console.error('Application form error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit application. Please try again later.' });
  }
});

module.exports = router;
