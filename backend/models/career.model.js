const mongoose = require('mongoose')

const CareerSchema = new mongoose.Schema({
    careerTitle: {
        type: String,
        min: 3,
        max: 160,
    },
    careerDescription: {
        type: {},
        min: 200,
        max: 2000000
    },
    careerTitle_en: {
        type: String,
        min: 3,
        max: 160,
    },
    careerDescription_en: {
        type: {},
        min: 200,
        max: 2000000
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    } 
},  { timestamps: true }
);

module.exports = mongoose.model('Career', CareerSchema);