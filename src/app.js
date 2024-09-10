// src/app.js

const express = require('express');
const listRoutes = require('./routes/listRoutes');
const userRoutes = require('./routes/userRoutes');  // Added this line
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use list routes
app.use('/lists', listRoutes);

// Use user routes
app.use('/users', userRoutes);  // Added this line

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
