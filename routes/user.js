const express = require('express');
const User = require('../models/User');
const authnticateUser = require('../middlewares/auth');

const router = express.Router();

router.get('/getAll', authnticateUser, (req, res, next) => {
  try {
    console.log('-->', req.headers.authorization);
    res.status(200).json({ message: 'Welcome' });
  } catch (err) {
    console.log('**', err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email
    });
    if (!user) {
      const error = new Error('wrong email or password!');
      error.statusCode = 401;
      throw error;
    }
    const isMatch = await user.checkPassword(password);
    if (isMatch) {
      const token = await user.generateToken();
      res.status(200).send({
        message: 'Logged in successfully',
        user,
        token
      });
    } else {
      const error = new Error('wrong username or password!');
      error.statusCode = 401;
      throw error;
    }
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  console.log('Hello from backend');

  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: 'user was registered successfully' });
  } catch (err) {
    console.log('ERRORZZ', err);
  }
});

module.exports = router;
