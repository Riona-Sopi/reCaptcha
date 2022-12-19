const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.router.js');
const userRoutes = require('./user.router.js');
const brandRoutes = require('./brand.router');

const careerRoutes = require('../routes/career.router');
const openingRoutes = require('../routes/opening.router');

router.use('/api', authRoutes);
router.use('/api', userRoutes);

router.use('/api', careerRoutes);

router.use('/api', openingRoutes);

router.use('/api', brandRoutes);

module.exports = router; 