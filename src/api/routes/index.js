// /src/api/routes/index.js
const express = require('express');
const router = express.Router();
const v1Routes = require('./V1');  // Path to V1 routes

// Mount version 1 routes under /v1
console.log('Mounting /api/v1 routes...');
router.use('/v1', v1Routes);

module.exports = router;
