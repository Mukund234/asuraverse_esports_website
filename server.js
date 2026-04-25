require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const contactRoute = require('./routes/contact');
const partnershipRoute = require('./routes/partnership');
const rosterRoute = require('./routes/roster');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
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

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'asuraverse_website.html'));
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`AsuraVerse server running at http://localhost:${PORT}`);
});
