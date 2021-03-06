const Blog = require('../models/Blog');
const User = require('../models/User');
const cloudinary = require('../handlers/Cloudinary');

const catchAsync = require('../utils/CatchAsync');
const CustomError = require('../utils/CustomError');

const getBlogs = catchAsync(async (req, res) => {
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
    .limit(limit)
    .lean();

  if (req.query.page) {
    const totalBlogs = await Blog.estimatedDocumentCount();
    if (skip >= totalBlogs) {
      // throw new Error();

      res.status(404).json({ message: 'You Checked All Posts 🎉' });
      return;
    }
  }

  res.send(blogs);
});

const addBlog = catchAsync(async (req, res) => {
  const placeholderImage =
    'http://res.cloudinary.com/dwcqkjkzg/image/upload/v1589982392/au4d2qhmqjxmjgrwo7qj.png';
  if (req.file) {
    const img = await cloudinary.uploader.upload(req.file.path);
    req.body.img = img.url;
  } else {
    req.body.img = placeholderImage;
  }
  req.body.author = req.user._id;
  const blog = new Blog(req.body);
  await blog.save();
  Blog.populate(blog, { path: 'author', select: 'username' }, function(
    err,
    blog
  ) {
    res.status(200).send({ message: 'blog was added successfully', blog });
  });
});

const updateBlog = catchAsync(async (req, res) => {
  if (req.file) {
    const img = await cloudinary.uploader.upload(req.file.path);
    req.body.img = img.url;
  } else {
    req.body.img = req.blog.img;
  }
  const { id } = req.blog;

  const blog = await Blog.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true
  });
  Blog.populate(blog, { path: 'author', select: 'username' }, function(
    err,
    blog
  ) {
    res.status(200).send({ message: 'blog was edited successfully', blog });
  });
});

const searchBlog = catchAsync(async (req, res) => {
  const { searchquery } = req.query;

  const [blogs = [], blogsByUser = [], blogsByTag = []] = await Promise.all([
    Blog.find({
      title: { $regex: new RegExp(searchquery), $options: 'i' }
    }).populate({
      path: 'author',
      select: 'username'
    }),

    User.find({
      username: { $regex: new RegExp(searchquery), $options: 'i' }
    })
      .select('blogs username')
      .populate('blogs'),

    Blog.find({ tags: { $all: [searchquery] } }).populate({
      path: 'author',
      select: 'username'
    })
  ]);

  let newData = [];
  if (blogsByUser.length) {
    newData = blogsByUser.map(el => {
      return el.blogs.map(blog => ({
        title: blog.title,
        body: blog.body,
        tags: blog.tags,
        img: blog.img,
        _id: blog.id,
        author: { _id: el.id, username: el.username }
      }));
    });
  }
  let flatData = [];
  newData.forEach(el => {
    flatData = [...flatData, ...el];
  });

  const result = [...blogs, ...blogsByTag, ...flatData];
  if (!result.length) res.send([]);

  //To remove duplicates
  let uniqueBlogs = result.reduce((distinctBlogs, blog) => {
    return distinctBlogs.findIndex(el => el._id === blog._id) === -1
      ? [...distinctBlogs, blog]
      : distinctBlogs;
  }, []);
  console.log(uniqueBlogs);

  res.send(uniqueBlogs);
});

const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new CustomError('No blog Found!', 404);

  res.status(200).send('Deleted');
});

module.exports = { getBlogs, addBlog, updateBlog, searchBlog, deleteBlog };
