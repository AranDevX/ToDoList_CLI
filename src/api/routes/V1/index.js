const express = require('express');
const listRoutes = require('./list/listRout');  // List routes
const userRoutes = require('./user/authRout');  // User routes

const router = express.Router();

// Mount list routes at /lists
router.use('/lists', listRoutes);

// Mount user routes at /user
router.use('/user', userRoutes);

module.exports = router;
