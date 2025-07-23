const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Donor form submission
app.post('/api/donor', (req, res) => {
  console.log('Donor form submitted:', req.body);
  const donorDataPath = path.join(dataDir, 'donors.json');

  let donors = [];
  if (fs.existsSync(donorDataPath)) {
    donors = JSON.parse(fs.readFileSync(donorDataPath));
  }

  donors.push(req.body);
  fs.writeFileSync(donorDataPath, JSON.stringify(donors, null, 2));
  res.send('Donor data saved successfully!');
});

// Receiver form submission
app.post('/api/receiver', (req, res) => {
  console.log('Receiver form submitted:', req.body);
  const receiverDataPath = path.join(dataDir, 'receivers.json');

  let receivers = [];
  if (fs.existsSync(receiverDataPath)) {
    receivers = JSON.parse(fs.readFileSync(receiverDataPath));
  }

  receivers.push(req.body);
  fs.writeFileSync(receiverDataPath, JSON.stringify(receivers, null, 2));
  res.send('Receiver data saved successfully!');
});

// Donation form submission
app.post('/api/funds', (req, res) => {
  console.log('Incoming Donation:', req.body);

  const { name, email, amount, payment_method, message } = req.body;

  if (!name || !email || !amount || !payment_method) {
    console.log('❌ Missing fields!');
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const fundsDataPath = path.join(dataDir, 'funds.json');
  let donations = [];

  if (fs.existsSync(fundsDataPath)) {
    const rawData = fs.readFileSync(fundsDataPath, 'utf-8');
    if (rawData) {
      donations = JSON.parse(rawData);
    }
  }

  const donation = {
    name,
    email,
    amount,
    payment_method,
    message,
    timestamp: new Date().toISOString()
  };

  donations.push(donation);
  fs.writeFileSync(fundsDataPath, JSON.stringify(donations, null, 2));
  console.log('✅ Donation saved successfully!');
  res.status(200).json({ message: 'Thank you for your donation!' });
});
// Surrogacy - Be a Surrogate form
app.post('/api/be_surrogate', (req, res) => {
  const bePath = path.join(dataDir, 'be_surrogate.json');
  let beData = [];

  if (fs.existsSync(bePath)) {
    beData = JSON.parse(fs.readFileSync(bePath));
  }

  beData.push(req.body);
  fs.writeFileSync(bePath, JSON.stringify(beData, null, 2));
  res.send('Surrogate registration saved successfully!');
});

// Surrogacy - Get a Surrogate form
app.post('/api/get_surrogate', (req, res) => {
  const getPath = path.join(dataDir, 'get_surrogate.json');
  let getData = [];

  if (fs.existsSync(getPath)) {
    getData = JSON.parse(fs.readFileSync(getPath));
  }

  getData.push(req.body);
  fs.writeFileSync(getPath, JSON.stringify(getData, null, 2));
  res.send('Surrogacy request saved successfully!');
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
