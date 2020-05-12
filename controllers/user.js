const User = require('../models/User');

const login = async (req, res, next) => {
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
};

const register = async (req, res, next) => {
  console.log('Hello from backend');

  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: 'user was registered successfully' });
  } catch (err) {
    console.log('ERRORZZ', err);
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findOne({
      _id: id
    })
      .populate('blogs')
      .populate('author');
    res.status(200).send(user);
  } catch (err) {
    res.status(404);
  }
};

const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req;
    //find if user.following list contains id
    if (!user.followingList.includes(id)) {
      console.log('true');
      await User.updateOne({ _id: user._id }, { $push: { followingList: id } });
      res.status(200).send(user);
    } else {
      await User.updateOne({ _id: user._id }, { $pull: { followingList: id } });
      res.status(200).send(user);
    }
  } catch (err) {
    console.log(err);

    res.send(err);
  }
};
module.exports = { register, login, getUserBlogs, followUser };
