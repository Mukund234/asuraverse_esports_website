require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const contactRoute = require('./routes/contact');
const partnershipRoute = require('./routes/partnership');
const rosterRoute = require('./routes/roster');

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['https://asuraverse.in', 'https://www.asuraverse.in', 'http://localhost:3000'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting for API routes ─────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 submissions per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' }
});

// ── Security Headers ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Enforce HTTPS for 1 year
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Restrict browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()' );

  // Content Security Policy
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",           // inline JS used in HTML pages
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '));

  next();
});

// ── Static files ─────────────────────────────────────────────────────────────
// Serve specific file types only (HTML, images, CSS, JS) from the public folder
app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  extensions: ['html']
}));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/contact', apiLimiter, contactRoute);
app.use('/api/partnership', apiLimiter, partnershipRoute);
app.use('/api/roster', apiLimiter, rosterRoute);

// ── Page Routes ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'asuraverse_website.html'));
});

app.get('/partner-with-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'partner-with-us.html'));
});

app.get('/roster-application', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'roster-application.html'));
});

app.get('/players', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'players.html'));
});

app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gallery.html'));
});

app.get('/founder', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'founder.html'));
});

app.get('/roster-poster', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'roster-poster.html'));
});

app.get('/achievement', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'achievement.html'));
});

app.get('/player', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'player.html'));
});

app.get('/opportunities', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'opportunities.html'));
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'asuraverse_website.html'));
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`AsuraVerse server running at http://localhost:${PORT}`);
});
