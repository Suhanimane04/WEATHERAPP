const axios = require('axios');
const { resolveLocation } = require('../utils/geocode');
const OWM_KEY = process.env.OWM_API_KEY;

async function getWeatherByInput(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'Query param q is required (e.g. ?q=London or ?q=12.34,56.78)' });

    // Resolve location
    const loc = await resolveLocation(q);

    // Prepare OpenWeather endpoints
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&units=metric&appid=${OWM_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.lat}&lon=${loc.lon}&units=metric&appid=${OWM_KEY}`;

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentUrl, { timeout: 8000 }),
      axios.get(forecastUrl, { timeout: 8000 })
    ]);

    return res.json({
      resolved: loc,
      current: currentRes.data,
      forecast: forecastRes.data
    });
  } catch (err) {
    console.error('getWeatherByInput err:', err.message || err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

module.exports = { getWeatherByInput };
