const express = require('express')
const router = express.Router();
const {create, list, update, read, remove} = require('../controllers/opening.controller.js');

//Authorization
const authorize = require('../middleware/authorize')
const Role = require('../middleware/role');


router.post('/opening', authorize([Role.Admin]), create); 
router.put('/opening/:slug', authorize([Role.Admin]), update);   
router.get('/opening/:slug', read);
router.delete('/opening/:slug', authorize([Role.Admin]), remove);
router.get('/openings', list);


module.exports = router; 