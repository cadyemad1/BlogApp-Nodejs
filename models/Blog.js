const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    require: [true, 'Blog must have a title']
  },
  body: {
    type: String,
    require: [true, 'Blog must have a body']
  },
  imgUrl: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [String]
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
