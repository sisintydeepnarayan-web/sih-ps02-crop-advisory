const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Crop Advisory & Distress Early-Warning System API',
    status: 'running',
    health: '/api/health',
    endpoints: [
      'GET  /api/health',
      'POST /api/farmers',
      'GET  /api/farmers/:id',
      'GET  /api/prices?crop=&district=',
      'POST /api/prices',
      'GET  /api/weather?district=&date=',
      'POST /api/weather',
      'GET  /api/schemes?q=',
      'POST /api/distress',
      'GET  /api/distress/:farmerId',
      'POST /api/mood',
      'GET  /api/mood/:farmerId'
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'smart-crop-advisory-backend'
  });
});

// ------------------------------------------------------------------------------
// Farmers Endpoints
// ------------------------------------------------------------------------------
app.post('/api/farmers', async (req, res) => {
  const { data, error } = await db.insertFarmer(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ data });
});

app.get('/api/farmers/:id', async (req, res) => {
  const { data, error } = await db.getFarmerById(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ message: 'Farmer not found' });
  res.json({ data });
});

// ------------------------------------------------------------------------------
// Crop Prices Endpoints
// ------------------------------------------------------------------------------
app.get('/api/prices', async (req, res) => {
  const { crop, district } = req.query;
  const { data, error } = await db.getPricesByCropAndDistrict(crop, district);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
});

app.post('/api/prices', async (req, res) => {
  const { data, error } = await db.insertPriceEntry(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ data });
});

// ------------------------------------------------------------------------------
// Weather Snapshots Endpoints
// ------------------------------------------------------------------------------
app.get('/api/weather', async (req, res) => {
  const { district, date } = req.query;
  if (!district) return res.status(400).json({ message: 'District query parameter is required' });
  const { data, error } = await db.getWeatherSnapshot(district, date);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
});

app.post('/api/weather', async (req, res) => {
  const { data, error } = await db.insertWeatherSnapshot(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ data });
});

// ------------------------------------------------------------------------------
// Schemes Directory Endpoints
// ------------------------------------------------------------------------------
app.get('/api/schemes', async (req, res) => {
  const { q } = req.query;
  const { data, error } = q ? await db.searchSchemes(q) : await db.getAllSchemes();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
});

// ------------------------------------------------------------------------------
// Distress Scores Endpoints
// ------------------------------------------------------------------------------
app.post('/api/distress', async (req, res) => {
  const { data, error } = await db.insertDistressScore(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ data });
});

app.get('/api/distress/:farmerId', async (req, res) => {
  const { data, error } = await db.getLatestDistressScore(req.params.farmerId);
  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ message: 'No distress record found for this farmer' });
  res.json({ data });
});

// ------------------------------------------------------------------------------
// Mood Checkins Endpoints
// ------------------------------------------------------------------------------
app.post('/api/mood', async (req, res) => {
  const { data, error } = await db.insertMoodCheckin(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ data });
});

app.get('/api/mood/:farmerId', async (req, res) => {
  const { data, error } = await db.getMoodHistory(req.params.farmerId);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});

