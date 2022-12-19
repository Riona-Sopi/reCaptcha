const Career = require('../models/career.model');
const validation = require('../validators/career.validation');
const slugify = require('slugify');
const _ = require('lodash');
const fs = require('fs');


exports.create = async (req, res) => {   
    try {  
        const { error } = validation.createValidation(req.body);

        if (error) return res.status(400).json({ error: error.details[0].message });

        const doesCareerExist = await Career.findOne({careerTitle: req.body.careerTitle});

        if (doesCareerExist) return res.status(400).json({ error: "This career section already exists" });

        const careerTitle = req.body.careerTitle;

        const career = new Career({
            careerTitle: req.body.careerTitle,
            careerDescription: req.body.careerDescription,
            careerTitle_en: req.body.careerTitle_en,
            careerDescription_en: req.body.careerDescription_en,
            postedBy: req.user._id,
            slug: slugify(careerTitle).toString().toLowerCase()
        });

        career.save();
        res.status(200).json(career);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        return;
    }
};
    


exports.update = async (req, res) => { 
    try { 
        const { error } = validation.editValidation(req.body);

        if (error) return res.status(400).json({ error: error.details[0].message });

        const slug = req.params.slug.toLowerCase();

        const update = {};

        if(req.body.careerTitle) update.careerTitle = req.body.careerTitle;
        if(req.body.careerDescription) update.careerDescription = req.body.careerDescription;
        if(req.body.careerTitle_en) update.careerTitle_en = req.body.careerTitle_en;
        if(req.body.careerDescription_en) update.careerDescription_en = req.body.careerDescription_en;
        if(req.body.careerTitle) update.slug = slugify(req.body.careerTitle).toString().toLowerCase();
        if(req.user._id) update.postedBy = req.user._id;

        Career.findOneAndUpdate({slug}, update, {
            new: true
        }).then(career => res.json(career))
        .catch(err => res.status(404).json(err));
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        return;
    }
};


exports.list = async (req, res) => {
    try {
        const career = await Career.find({})
        .populate('postedBy', '_id name username')
        .select('_id careerTitle careerDescription careerTitle_en careerDescription_en slug postedBy createdAt updatedAt')

        res.status(200).json(career);
    } catch (error) {
    res.status(500).json( { error: error.message });
    }
};


exports.read = async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();

        const career = await Career.findOne({slug})
        .populate('postedBy', '_id name username')
        .select('_id careerTitle careerDescription careerTitle_en careerDescription_en slug postedBy createdAt updatedAt')

        if (!career) return res.status(400).json({ error: "Career does not exist." });

        res.status(200).json(career);
    } catch (error) {
        res.status(500).json( { error: error.message });
    }
};


exports.remove = async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();
    
        await Career.findOneAndRemove({ slug });

        res.status(200).json( "Career successfully deleted" );
    } catch (error) {
        res.status(500).json( { error: error.message });
    }
};





