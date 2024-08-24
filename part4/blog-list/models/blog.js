const mongoose = require('mongoose');
const schemaTransformer = require('../utils/schemaTransformer');

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})


schemaTransformer(blogSchema);

module.exports = mongoose.model('Blog', blogSchema);
  
