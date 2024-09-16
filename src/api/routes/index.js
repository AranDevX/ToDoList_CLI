const express = require('express');
const v1Routes = require('./V1/index');  // Import V1 routes

const router = express.Router();

// Mount the V1 routes at /api/v1
router.use('/v1', v1Routes);

module.exports = router;
