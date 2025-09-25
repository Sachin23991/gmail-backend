// Load environment variables from a .env file for local development
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

// --- 1. INITIALIZE THE APP ---
const app = express();

// --- 2. CONFIGURATION & MIDDLEWARE ---

// This line is crucial for Railway. It uses the port Railway provides,
// or defaults to 3001 if you're running it locally.
const PORT = process.env.PORT || 3001;

// Secure CORS setup: Replace with your deployed frontend URL
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Enable the server to parse incoming JSON data
app.use(express.json());

// Set the SendGrid API key from your environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- 3. API ENDPOINTS ---

// Health Check Endpoint: Helps verify the server is running
app.get('/', (req, res) => {
  res.status(200).send('Career Flow API is running...');
});

// Endpoint to send the welcome email
app.post('/api/send-welcome-email', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields.' });
  }

  const msg = {
    to: email,
    from: 'careerflowsh@gmail.com', // Your verified SendGrid sender
    subject: '🚀 Welcome to Career Flow – Your Future Just Got an Upgrade!',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi ${name},</p>
        <p>You’ve just unlocked Career Flow — where careers stop being confusing, and start being exciting. 🎯</p>
        <p>At Career Flow, we don’t just guide you. We walk with you, mentor you, and cheer for you until you hit your career milestones.</p>
        <br>
        <p>See you on the inside,</p>
        <p><strong>The Career Flow Team</strong></p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`Welcome email sent successfully to: ${email}`);
    res.status(200).json({ success: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// --- 4. START THE SERVER ---
app.listen(PORT, () => {
  console.log(`✅ Backend server is listening on port ${PORT}`);
});