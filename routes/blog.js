const express = require('express');
const Blog = require('../models/Blog');
const authnticateUser = require('../middlewares/auth');
const validateOwnership = require('../middlewares/ValidateOwnership');
const {
  getBlogs,
  addBlog,
  updateBlog,
  searchBlog,
  deleteBlog
} = require('../controllers/blog');

const router = express.Router();

router.get('/getBlogs', getBlogs);

router.post('/addBlog', authnticateUser, addBlog);

router.patch('/:id', authnticateUser, validateOwnership, updateBlog);

router.get('/search', searchBlog);

router.delete('/:id', deleteBlog);

module.exports = router;
