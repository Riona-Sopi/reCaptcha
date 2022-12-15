const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    min: 3,
    max: 160,
  },
  info: {
    type: {},
    min: 200,
    max: 2000000
  },
  address: {
    type: String,
    trim: true,
    min: 3,
    max: 160,
  },
  phone:{
    type: String,
    trim: true,
    min: 3,
    max: 160,
  },
  email:{
    type: String,
    trim: true,
    min: 3,
    max: 160,
  },
  onlineLink:{
    type: String,
    trim: true,
    min: 3,
    max: 160,
  },
  info_en: {
    type: {},
    min: 200,
    max: 2000000
  },
  address_en: {
    type: String,
    trim: true,
    min: 3,
    max: 160,
  },
  onlineLink_en:{
    type: String,
    trim: true,
    min: 3,
    max: 160,
  },
  logo: {
    type: String,
  },
  planimetry:{
    type: String,
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

 },  { timestamps: true }

);

module.exports = mongoose.model('Brand', BrandSchema);
