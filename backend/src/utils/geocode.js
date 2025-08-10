const axios = require('axios');
const OWM_KEY = process.env.OWM_API_KEY;

// Try to interpret input as "lat,lon" first; otherwise call OpenWeatherMap direct geocoding
async function resolveLocation(input) {
  input = (input || '').trim();
  if (!input) throw new Error('Empty location input');

  // lat,lon match
  const latlonMatch = input.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
  if (latlonMatch) {
    return {
      name: input,
      lat: parseFloat(latlonMatch[1]),
      lon: parseFloat(latlonMatch[3]),
      country: ''
    };
  }

  // Use OpenWeatherMap direct geocoding
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=1&appid=${OWM_KEY}`;
  const res = await axios.get(url, { timeout: 8000 });
  if (res.data && res.data.length > 0) {
    const r = res.data[0];
    const name = `${r.name}${r.state ? ', ' + r.state : ''}, ${r.country}`;
    return { name, lat: r.lat, lon: r.lon, country: r.country };
  }
  throw new Error('Location not found');
}

module.exports = { resolveLocation };
