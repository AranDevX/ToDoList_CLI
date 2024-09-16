const express = require('express');
const routes = require('../api/routes/V1/index');

const app = express();

// Load routes
app.use('/api/v1', routes);

module.exports = app;
