
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Email configuration
const EMAIL_USER = 'larrydavid7730@gmail.com';
const EMAIL_PASS = 'ffrl ohvt rqke sows';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Email sending endpoint
app.post('/api/send-pin', async (req, res) => {
  try {
    const { email, name, regNumber } = req.body;

    if (!email || !name || !regNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const PIN = '1234';

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'UUMSA Batch XIX E-Voting Portal - Your PIN',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">UUMSA Batch XIX E-Voting Portal</h2>
          <p>Dear ${name},</p>
          <p>Your voting PIN has been generated successfully.</p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0; color: #1f2937;">Your Voting PIN:</h3>
            <div style="font-size: 24px; font-weight: bold; color: #7c3aed; margin: 10px 0;">${PIN}</div>
          </div>

          <p><strong>Registration Number:</strong> ${regNumber}</p>
          <p>Please use this PIN to access the voting portal and cast your vote.</p>

          <p style="color: #6b7280; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            University of Uyo - Medical Students' Association<br>
            Batch XIX E-Voting System
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'PIN sent successfully to your email address',
      pin: PIN // For demo purposes, you might want to remove this in production
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`UUMSA E-Voting Portal running on http://localhost:${PORT}`);
  console.log('Make sure to update EMAIL_USER and EMAIL_PASS in server.js');
});