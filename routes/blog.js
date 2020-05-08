const express = require('express');
const Blog = require('../models/Blog');
const authnticateUser = require('../middlewares/auth');

const router = express.Router();

router.get('/getBlogs', async (req, res, next) => {
  try {
    const page = req.query.page * 1;
    const limit = req.query.limit * 1;
    const skip = (page - 1) * limit;
    const blogs = await Blog.find({})
      .populate({
        path: 'author',
        select: 'username'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    if (req.query.page) {
      const totalBlogs = await Blog.estimatedDocumentCount();
      if (skip >= totalBlogs) throw new Error();
    }
    res.send(blogs);
  } catch (err) {
    console.log('**', err);
  }
});

router.post('/addBlog', async (req, res, next) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(200).json({ message: 'blog was added successfully' });
  } catch (err) {
    console.log('ERRORZZ', err);
  }
});

module.exports = router;
