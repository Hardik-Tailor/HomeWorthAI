const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/predict', (req, res) => {
  const { area, bedrooms, bathrooms, floors, year, tier } = req.body;

  // Basic validation
  if ([area, bedrooms, bathrooms, floors, year, tier].some(v => v === undefined || v === '' || isNaN(v))) {
    return res.status(400).json({ success: false, error: 'All fields are required and must be numbers.' });
  }

  const python = spawn('python', [
    path.join(__dirname, 'predict.py'),
    area, bedrooms, bathrooms, floors, year, tier
  ], { cwd: __dirname });

  let output = '';
  let errOutput = '';

  python.stdout.on('data', (data) => { output += data.toString(); });
  python.stderr.on('data', (data) => { errOutput += data.toString(); });

  python.on('close', (code) => {
    try {
      const result = JSON.parse(output.trim());
      res.json(result);
    } catch (e) {
      res.status(500).json({ success: false, error: errOutput || 'Prediction failed.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n🏠  Housing Price Estimator running at http://localhost:${PORT}\n`);
});
