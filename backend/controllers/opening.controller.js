const Opening = require('../models/opening.model');
const validation = require('../validators/opening.validation');
const slugify = require('slugify');
const _ = require('lodash');
const fs = require('fs');


exports.create = async (req, res) => {   
    try {  
        const { error } = validation.createValidation(req.body);

        if (error) return res.status(400).json({ error: error.details[0].message });

        const doesOpeningExist = await Opening.findOne({name: req.body.name});

        if (doesOpeningExist) return res.status(400).json({ error: "This opening already exists" });

        const name = req.body.name;

        const opening = new Opening({
            name: req.body.name,
            name_en: req.body.name_en,
            postedBy: req.user._id,
            slug: slugify(name).toString().toLowerCase()
        });

        opening.save();
        res.status(200).json(opening);
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

        if(req.body.name) update.name = req.body.name;
        if(req.body.name_en) update.name_en = req.body.name_en;
        if(req.body.name) update.slug = slugify(req.body.name).toString().toLowerCase();
        if(req.user._id) update.postedBy = req.user._id;

        Opening.findOneAndUpdate({slug}, update, {
            new: true
        }).then(opening => res.json(opening))
        .catch(err => res.status(404).json(err));
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        return;
    }
};


exports.list = async (req, res) => {
    try {
        const opening = await Opening.find({})
        .populate('postedBy', '_id name username')
        .select('_id name name_en slug postedBy createdAt updatedAt')

        res.status(200).json(opening);
    } catch (error) {
    res.status(500).json( { error: error.message });
    }
};


exports.read = async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();

        const opening = await Opening.findOne({slug})
        .populate('postedBy', '_id name username')
        .select('_id name name_en slug postedBy createdAt updatedAt')

        if (!opening) return res.status(400).json({ error: "Opening does not exist." });

        res.status(200).json(opening);
    } catch (error) {
        res.status(500).json( { error: error.message });
    }
};


exports.remove = async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();
    
        await Opening.findOneAndRemove({ slug });

        res.status(200).json( "Opening successfully deleted" );
    } catch (error) {
        res.status(500).json( { error: error.message });
    }
};


exports.listSearch = (req, res) => {
    console.log(req.query);
    const { search } = req.query;
    if (search) {
        Opening.find(
            {
                $or: [{ name: { $regex: search, $options: 'i' } }]
            },
            (err, openings) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(openings);
            }
        ).select('');
    }
};




