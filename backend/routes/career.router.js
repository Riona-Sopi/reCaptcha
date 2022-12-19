const express = require('express')
const router = express.Router();
const {create, list, update, read} = require('../controllers/career.controller.js');

//Authorization
const authorize = require('../middleware/authorize')
const Role = require('../middleware/role');


router.post('/career', authorize([Role.Admin]), create); 
router.put('/career/:slug', authorize([Role.Admin]), update);   
router.get('/career/:slug', read);
router.get('/career', list);


module.exports = router; 