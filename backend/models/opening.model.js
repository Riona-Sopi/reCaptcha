const mongoose = require('mongoose');

const OpeningSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    min: 3,
    max: 160,
  },
  name_en: {
    type: String,
    trim: true,
    min: 3,
    max: 160,
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  postedBy:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
  } 

 },  {timestamps: true}

);

module.exports = mongoose.model('Opening', OpeningSchema);
