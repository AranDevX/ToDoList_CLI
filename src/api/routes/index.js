// /src/api/routes/index.js
const express = require('express');
const router = express.Router();
const v1Routes = require('./V1');  // Path to version 1 routes (adjust path if needed)

// Mount version 1 routes under /v1
console.log('Mounting /api/v1 routes...');
router.use('/v1', v1Routes);

// Optionally, log all registered routes
router.stack.forEach(function(r) {
    if (r.route && r.route.path) {
        console.log(`Registered route: ${r.route.path}`);
    }
});

module.exports = router;
