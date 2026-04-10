# AsuraVerse Esports Website

Full-stack website for **Team AsuraVerse Esports Pvt Ltd** — featuring contact, partnership inquiry, and player roster application forms powered by Express.js and Nodemailer.

---

## Features

- 🏠 Main landing page (`asuraverse_website.html`)
- 📬 Contact Us form with Nodemailer email delivery
- 🤝 Partner With Us page (`/partner-with-us`) with partnership inquiry form
- 🎮 Roster Application page (`/roster-application`) with player tryout form
- ✉️ Confirmation emails sent to both admin and the submitting user
- 📱 Fully responsive, matches the existing dark esports theme

---

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JS
- **Backend**: Node.js, Express.js
- **Email**: Nodemailer (Gmail SMTP)
- **Config**: dotenv

---

## Setup

### 1. Prerequisites

- Node.js ≥ 18
- A Gmail account with [2-Step Verification](https://myaccount.google.com/security) enabled

### 2. Clone and install

```bash
git clone https://github.com/Mukund234/asuraverse_esports_website.git
cd asuraverse_esports_website
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your credentials:

```env
PORT=3000

# Gmail address used to SEND emails
EMAIL_USER=your_gmail@gmail.com

# Gmail App Password (NOT your account password)
# Generate one at: https://myaccount.google.com/apppasswords
EMAIL_PASS=your_16_char_app_password

# Address that receives all form notifications
ADMIN_EMAIL=teamasuraverse@gmail.com
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

### 4. Run the server

**Development** (auto-restarts on file changes):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

The site will be available at **http://localhost:3000**.

---

## Pages & API Routes

| URL | Description |
|---|---|
| `/` | Main landing page |
| `/partner-with-us` | Partnership inquiry page |
| `/roster-application` | Player roster application page |
| `POST /api/contact` | Contact form submission |
| `POST /api/partnership` | Partnership inquiry submission |
| `POST /api/roster` | Roster application submission |

---

## Project Structure

```
├── server.js                  # Express backend
├── package.json               # Node dependencies
├── .env.example               # Environment variables template
├── .gitignore
├── asuraverse_website.html    # Main landing page
├── partner-with-us.html       # Partnership page
├── roster-application.html    # Roster application page
├── routes/
│   ├── contact.js             # Contact form handler
│   ├── partnership.js         # Partnership inquiry handler
│   └── roster.js              # Roster application handler
├── utils/
│   └── mailer.js              # Nodemailer transporter factory
└── README.md
```

---

## Gmail App Password

1. Go to [Google Account → Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Search for **App Passwords** and create one for "Mail"
4. Copy the 16-character password into `EMAIL_PASS` in your `.env` file

---

## License

MIT — © 2025 Team AsuraVerse Esports Pvt Ltd
