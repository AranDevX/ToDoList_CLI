require('dotenv').config({ path: '../.env' });

const express = require('express');
const app = express();
const apiRoutes = require('./api/routes');  // Path to your main routes index

// Middleware to parse JSON requests
app.use(express.json());

// Mount API routes under /api
console.log('Mounting /api routes...');
app.use('/api', apiRoutes);

// Log all registered routes after mounting them
app._router.stack.forEach(function(r) {
    if (r.route && r.route.path) {
        console.log(`Registered route: ${r.route.path}`);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
