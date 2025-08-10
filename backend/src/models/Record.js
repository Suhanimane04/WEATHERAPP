const mongoose = require('mongoose');

const ResolvedSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lon: Number,
  country: String
}, { _id: false });

const RecordSchema = new mongoose.Schema({
  input: { type: String, required: true },           // raw user input
  resolved: { type: ResolvedSchema, required: true },// resolved location
  dateRange: {
    start: Date,
    end: Date
  },
  weatherData: mongoose.Schema.Types.Mixed, // store API response snapshot
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', RecordSchema);
