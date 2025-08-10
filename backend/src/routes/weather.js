const express = require('express');
const router = express.Router();
const { getWeatherByInput } = require('../controllers/weatherController');

router.get('/', getWeatherByInput);

module.exports = router;
