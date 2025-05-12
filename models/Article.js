const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'archived','blocked'],
    default: 'pending',
  },
  publish:{
    type:Boolean,
    default:false
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
 
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
