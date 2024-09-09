// app.js
const express = require('express');
const listRoutes = require('./src/routes/listRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Use the routes from routes/listRoutes.js
app.use('/lists', listRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
