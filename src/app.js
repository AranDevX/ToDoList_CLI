const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const express = require('express');
const listRoutes = require('./routes/listRoutes');
const userRoutes = require('./routes/userRoutes');  // Added this line


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
console.log("DATABASE_URL:", process.env.DATABASE_URL);
