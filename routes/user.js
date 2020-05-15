const express = require('express');
const User = require('../models/User');
const authnticateUser = require('../middlewares/auth');
const {
  login,
  register,
  getUserBlogs,
  followUser,
  getFollowersBlog
} = require('../controllers/user');
const { check } = require('express-validator');
const validationReqs = require('../middlewares/validateRequests');

const router = express.Router();

router.post(
  '/login',
  validationReqs([check('password').notEmpty(), check('email').notEmpty()]),
  login
);

router.post(
  '/register',
  validationReqs([
    check('username').notEmpty(),
    check('password').notEmpty(),
    check('email').notEmpty()
  ]),
  register
);

router.get('/', authnticateUser, getUserBlogs);

router.patch('/:id', authnticateUser, followUser);

router.get('/followed', authnticateUser, getFollowersBlog);
module.exports = router;
