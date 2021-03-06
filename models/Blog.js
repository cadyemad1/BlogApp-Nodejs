const mongoose = require('mongoose');

var omit = require('lodash.omit');

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog must have a title']
    },
    body: {
      type: String,
      required: [true, 'Blog must have a body']
    },
    img: {
      type: String
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    tags: [String]
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => omit(ret, ['__v']),
      virtuals: true
    },
    toObject: { virtuals: true }
  }
);

blogSchema.index({ title: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
