const express = require('express');
const router = express.Router();
const Multer = require('../middleware/multerCareers');
const {signup, signin, signout, forgotPassword, resetPassword, list, update, contactFormSendEmail, careerFormSendEmail} = require('../controllers/auth.controller');


const multer = require("multer");


const uploadMiddleware = (req,res,next)=>{
    const upload = Multer.upload.fields([{name: "cv"}, {name: "image"}]);
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Problem në shkarkimin e dokumenteve. Provoni përsëri më vonë!" })
        } else if (err) {
        return res.status(400).json({ error: "Provoni përsëri më vonë!" })
        }
        next()
    })
}

//Authorization
const authorize = require('../middleware/authorize')
const Role = require('../middleware/role');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);
router.get('/users', list);
// router.get('/user/:id', update);
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);
router.post('/sendEmail', contactFormSendEmail);
router.post('/sendApplication', uploadMiddleware, careerFormSendEmail);



module.exports = router; 