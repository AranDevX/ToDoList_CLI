const express = require('express');
const routes = require('../api/routes/V1/index');

const app = express();

// Middleware to parse JSON requests
app.use(express.json()); 

// Load routes
app.use('/api/v1', routes);

module.exports = app;
