const express = require('express')
const router = express.Router();
const Multer = require('../middleware/multer');
const {create, list, remove, update, read, listSearch} = require('../controllers/brand.controller.js');

//Authorization
const authorize = require('../middleware/authorize')
const Role = require('../middleware/role');

const Brand = require('../models/brand.model');

const paginator = require('../middleware/paginate');

router.post('/brand', authorize([Role.Admin]), Multer.upload.fields([{name: "logo"}, {name: "planimetry"}]), create); 
router.put('/brand/:slug', authorize([Role.Admin]), Multer.upload.fields([{name: "logo"}, {name: "planimetry"}]), update);   
router.delete('/brand/:slug', authorize([Role.Admin]), remove);
router.get('/brand/:slug', read);

router.get('/brands', paginator.paginatedResults(Brand), (req, res) => {
    res.json(res.paginatedResults);
});

router.get('/brands/search', listSearch);


module.exports = router; 