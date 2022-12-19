const Brand = require('../models/brand.model');
const validation = require('../validators/brand.validation');
const slugify = require('slugify');
const {MongoClient} = require("mongodb");
const client = new MongoClient(process.env.DATABASE);
// client.connect().then(() => console.log("connected to db"));



const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require('lodash');
const fs = require('fs');
// const paginatedResults = require('../middleware/paginate');
const paginator = require('../middleware/paginate');


exports.create = async (req, res) => {   
    try {  
        const { error } = validation.createValidation(req.body);

        if (error) return res.status(400).json({ error: error.details[0].message });

        const doesBrandExist = await Brand.findOne({name: req.body.name});

        if (doesBrandExist) return res.status(400).json({ error: "This brand already exists" });

        if (!req.files.logo) return res.status(400).json({ error: "Logo image for this brand is required" });

        if (!req.files.planimetry) return res.status(400).json({ error: "Planimetry image for this brand is required" });

        const name = req.body.name;

        const brand = new Brand({
            name:  req.body.name,
            info:  req.body.info,
            address: req.body.address,
            phone: req.body.phone,
            onlineLink: req.body.onlineLink,
            email: req.body.email,
            floor: req.body.floor,
            floor_en: req.body.floor_en,

            info_en:  req.body.info_en,
            address_en: req.body.address_en,
            onlineLink_en: req.body.onlineLink_en,

            logo: req.files.logo[0].path,
            planimetry: req.files.planimetry[0].path,
            postedBy: req.user._id,
            slug: slugify(name).toString().toLowerCase()
        });

        brand.save();
        res.status(200).json(brand);
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
        if(req.body.onlineLink) update.onlineLink = req.body.onlineLink;
        if(req.body.info) update.info = req.body.info;
        if(req.body.address) update.address = req.body.address;
        if(req.body.phone) update.phone = req.body.phone;
        if(req.body.email) update.email = req.body.email;
        if(req.body.floor) update.floor = req.body.floor;
        if(req.body.floor_en) update.floor_en = req.body.floor_en;

        if(req.body.info_en) update.info_en = req.body.info_en;
        if(req.body.address_en) update.address_en = req.body.address_en;
        if(req.body.onlineLink_en) update.onlineLink_en = req.body.onlineLink_en;

        if(req.body.name) update.slug = slugify(req.body.name).toString().toLowerCase();
        if(req.user._id) update.postedBy = req.user._id;

        if(req.files.logo){
            Brand.findOne({slug}).then(brand => {
                fs.unlink(brand.logo, (err) => {if (err) throw err;})
            })
            update.logo = req.files.logo[0].path
        }

        if(req.files.planimetry){
            Brand.findOne({slug}).then(brand => {
                fs.unlink(brand.planimetry, (err) => {if (err) throw err;})
            })
            update.planimetry = req.files.planimetry[0].path
        }
    
        Brand.findOneAndUpdate({slug}, update, {
            new: true
        }).then(brand => res.json(brand))
        .catch(err => res.status(404).json(err));
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
        return;
    }
};


exports.list = async (req, res) => {
    try {
        const brands = await Brand.find({})
        .populate('postedBy', '_id name username')
        .select('_id name info address phone email floor floor_en info_en address_en onlineLink_en logo planimetry onlineLink slug postedBy createdAt updatedAt')

        res.status(200).json(brands);
    } catch (error) {
    res.status(500).json( { error: error.message });
    }
};

exports.read = async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();

        const brand = await Brand.findOne({slug})
        .populate('postedBy', '_id name username')
        .select('_id name info address phone email floor floor_en info_en address_en onlineLink_en logo planimetry onlineLink slug postedBy createdAt updatedAt')

        if (!brand) return res.status(400).json({ error: "Brand does not exist." });

        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json( { error: error.message });
    }
};


exports.remove = async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase();
    
        await Brand.findOneAndRemove({ slug });

        res.status(200).json( "Brand successfully deleted" );
    } catch (error) {
        res.status(500).json( { error: error.message });
    }
};


exports.listSearch = (req, res) => {
    console.log(req.query);
    const { search } = req.query;
    if (search) {
        Brand.find(
            {
                $or: [{ name: { $regex: search, $options: 'i' } }]
            },
            (err, brands) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(brands);
            }
        ).select('-planimetry -info -address -email -phone -onlineLink');
    }
};

exports.autocomplete = async (req, res) => {
    try {
        if (req.query.brand) {
            let results;
            // if (req.query.brand.includes(",") || req.query.brand.includes(" ")) {
              results = await client
                .db("AlbiMallDatabase")
                .collection("brands")
                .aggregate([
                  {
                    $search: {
                      index: "autocomplete",
                      autocomplete: {
                        query: req.query.brand,
                        path: "name",
                        fuzzy: {
                          maxEdits: 1,
                        },
                        tokenOrder: "sequential",
                      },
                    },
                  },
                  {
                    $project: {
                      name: 1,
                      logo: 1,
                      slug: 1,
                      _id: 1,
                      score: { $meta: "searchScore" },
                    },
                  },
                  {
                    $limit: 10,
                  },
                ])
                .toArray();
      
              return res.send(results);
 
      }

      res.send([]);
        
  }catch (error) {
    console.error(error);
    res.send([]);
  }
};




