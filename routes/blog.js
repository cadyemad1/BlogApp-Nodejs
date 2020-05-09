const express = require('express');
const Blog = require('../models/Blog');
const authnticateUser = require('../middlewares/auth');
const validateOwnership = require('../middlewares/ValidateOwnership');
const { getBlogs, addBlog, updateBlog } = require('../controllers/blog');

const router = express.Router();

router.get('/getBlogs', getBlogs);

router.post('/addBlog', addBlog);

router.patch('/:id', authnticateUser, validateOwnership, updateBlog);

module.exports = router;
