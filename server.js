const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected')).catch(console.error);
}

const inquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  destination: String,
  travelDate: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);

app.post('/api/inquiry', async (req, res) => {
  try {
    const payload = req.body;
    if (mongoose.connection.readyState === 1) await Inquiry.create(payload);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: 'fcpsunrise@gmail.com',
        subject: `New Travel Inquiry: ${payload.destination}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nTravel Date: ${payload.travelDate}\n\n${payload.message}`
      });
    }

    res.json({ ok: true, message: 'Inquiry received' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Failed to send inquiry' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
