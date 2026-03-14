const express = require('express');
const router = express.Router();
const storage = require('../services/storage');

// POST /api/telemetry
// Receives telemetry data from ESP8266
router.post('/telemetry', (req, res) => {
  try {
    const data = req.body;
    
    // Validate basic required fields
    if (data.temperature === undefined || data.pressure === undefined) {
      return res.status(400).json({ error: 'Missing required telemetry fields' });
    }

    // Add to storage
    const savedData = storage.addTelemetry(data);
    
    // Broadcast to all connected socket clients
    const io = req.app.get('io');
    if (io) {
      io.emit('telemetry_update', savedData);
    }
    
    res.status(200).json({ success: true, message: 'Telemetry received' });
  } catch (err) {
    console.error('Error processing telemetry:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/telemetry
// Returns the latest telemetry data
router.get('/telemetry', (req, res) => {
  const latest = storage.getLatestTelemetry();
  if (!latest) {
    return res.status(404).json({ error: 'No telemetry data available yet' });
  }
  res.status(200).json(latest);
});

// GET /api/telemetry/history
// Returns telemetry history for charts
router.get('/telemetry/history', (req, res) => {
  const history = storage.getTelemetryHistory();
  res.status(200).json(history);
});

module.exports = router;
