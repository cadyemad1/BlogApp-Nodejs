const User = require('../models/User');
const Blog = require('../models/Blog');
const catchAsync = require('../utils/CatchAsync');

const login = catchAsync(async (req, res, next) => {
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
});

const register = catchAsync(async (req, res, next) => {
  const user = new User(req.body);
  await user.save();
  const token = await user.generateToken();
  res.status(200).send({
    message: 'Registered  successfully',
    user,
    token
  });
});

const getUserBlogs = catchAsync(async (req, res) => {
  const { id } = req.query;
  const user = await User.findOne({
    _id: id
  })
    .populate('blogs')
    .populate('author');

  if (!user) throw new CustomError('No user Found!', 404);
  res.status(200).send(user);
});

const followUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  //find if user.following list contains id
  if (!user.followingList.includes(id)) {
    await User.updateOne({ _id: user._id }, { $push: { followingList: id } });
    res.status(200).send(user);
  } else {
    await User.updateOne({ _id: user._id }, { $pull: { followingList: id } });
    res.status(200).send(user);
  }
});

const getFollowersBlog = catchAsync(async (req, res) => {
  const { followingList } = req.user;
  const page = req.query.page * 1;
  const limit = req.query.limit * 1;
  const skip = (page - 1) * limit;

  const blogs = await Blog.find({ author: followingList })
    .populate({
      path: 'author',
      select: 'username'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).send(blogs);
});

module.exports = {
  register,
  login,
  getUserBlogs,
  followUser,
  getFollowersBlog
};
