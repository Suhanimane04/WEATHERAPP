const Record = require('../models/Record');
const { resolveLocation } = require('../utils/geocode');
const axios = require('axios');
const Joi = require('joi');

const OWM_KEY = process.env.OWM_API_KEY;

const createSchema = Joi.object({
  input: Joi.string().required(),
  startDate: Joi.date().optional().allow(null),
  endDate: Joi.date().optional().allow(null),
  notes: Joi.string().optional().allow('', null)
});

async function createRecord(req, res) {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { input, startDate, endDate, notes } = value;
    const loc = await resolveLocation(input);

    // fetch snapshot of weather (current + forecast)
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&units=metric&appid=${OWM_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.lat}&lon=${loc.lon}&units=metric&appid=${OWM_KEY}`;
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentUrl),
      axios.get(forecastUrl)
    ]);

    const record = new Record({
      input,
      resolved: loc,
      dateRange: { start: startDate || null, end: endDate || null },
      weatherData: { current: currentRes.data, forecast: forecastRes.data },
      notes
    });

    await record.save();
    return res.status(201).json(record);
  } catch (err) {
    console.error('createRecord error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

async function getRecords(req, res) {
  try {
    const q = req.query.q || null;
    const filter = {};
    if (q) filter.input = new RegExp(q, 'i');
    const records = await Record.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.json(records);
  } catch (err) {
    console.error('getRecords error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

async function getRecordById(req, res) {
  try {
    const rec = await Record.findById(req.params.id);
    if (!rec) return res.status(404).json({ error: 'Record not found' });
    return res.json(rec);
  } catch (err) {
    console.error('getRecordById error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

async function updateRecord(req, res) {
  try {
    const updates = {};
    if (req.body.notes !== undefined) updates.notes = req.body.notes;
    if (req.body.startDate !== undefined || req.body.endDate !== undefined) {
      updates.dateRange = {
        start: req.body.startDate || null,
        end: req.body.endDate || null
      };
    }
    const rec = await Record.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!rec) return res.status(404).json({ error: 'Record not found' });
    return res.json(rec);
  } catch (err) {
    console.error('updateRecord error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

async function deleteRecord(req, res) {
  try {
    const rec = await Record.findByIdAndDelete(req.params.id);
    if (!rec) return res.status(404).json({ error: 'Record not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('deleteRecord error:', err.message || err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};
