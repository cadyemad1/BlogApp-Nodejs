const express = require('express');
const Blog = require('../models/Blog');
const authnticateUser = require('../middlewares/auth');
const validateOwnership = require('../middlewares/ValidateOwnership');
const { uploadUserPhoto, resizeImage } = require('../middlewares/Upload');
const {
  getBlogs,
  addBlog,
  updateBlog,
  searchBlog,
  deleteBlog
} = require('../controllers/blog');

const { check } = require('express-validator');
const validationReqs = require('../middlewares/validateRequests');

const router = express.Router();

router.get('/getBlogs', getBlogs);

router.post(
  '/addBlog',
  authnticateUser,
  uploadUserPhoto,
  validationReqs([check('title').notEmpty(), check('body').notEmpty()]),
  addBlog
);

router.patch(
  '/:id',
  authnticateUser,
  validateOwnership,
  validationReqs([check('title').notEmpty(), check('body').notEmpty()]),
  updateBlog
);

router.get('/search', searchBlog);

router.delete('/:id', deleteBlog);

module.exports = router;
