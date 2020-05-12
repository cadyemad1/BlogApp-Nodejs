const express = require('express');
const User = require('../models/User');
const authnticateUser = require('../middlewares/auth');
const {
  login,
  register,
  getUserBlogs,
  followUser
} = require('../controllers/user');

const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/', getUserBlogs);

router.patch('/:id', authnticateUser, followUser);

module.exports = router;
