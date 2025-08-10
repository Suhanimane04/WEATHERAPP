require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const weatherRoutes = require('./routes/weather');
const recordRoutes = require('./routes/records');

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/weather', weatherRoutes);
app.use('/api/records', recordRoutes);

// basic health endpoint
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

const PORT = process.env.PORT || 5001;

// connect to mongo then start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
