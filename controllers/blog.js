const Blog = require('../models/Blog');
const User = require('../models/User');
const cloudinary = require('../handlers/cloudinary');

const catchAsync = require('../utils/CatchAsync');

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
  //test leaan
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
  if (req.file) {
    const img = await cloudinary.uploader.upload(req.file.path);
    req.body.img = img.url;
    req.body.author = req.user._id;
    // const fileName = req.file.filename;
    // req.body = { ...req.body, img: fileName };
  }
  const blog = new Blog(req.body);
  await blog.save();
  res.send(blog);
  // res.status(200).json({ message: 'blog was added successfully' });
});

const updateBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
    useFindAndModify: false
  });
  res
    .status(200)
    .json({ message: 'Blog was edited successfully', updatedBlog });
});

const searchBlog = catchAsync(async (req, res) => {
  const { searchquery } = req.query;
  // const blogs = await Blog.findAll({ $text: { $search: searchquery } });
  const [blogs = [], blogsByUser = [], blogsByTag = []] = await Promise.all([
    Blog.find({
      title: { $regex: new RegExp(searchquery) }
    }).populate({
      path: 'author',
      select: 'username'
    }),

    User.find({
      username: { $regex: new RegExp(searchquery) }
    })
      .select('blogs username')
      .populate('blogs'),

    Blog.find({ tags: [searchquery] }).populate({
      path: 'author',
      select: 'username'
    })
  ]);

  //to return only blogs inside User without username
  let userBlogs = [];
  if (blogsByUser.length) {
    blogsByUser.forEach(el => {
      userBlogs = el.blogs;
    });
  }

  const result = [...blogs, ...blogsByTag, ...blogsByUser];
  if (!result.length) throw new Error();

  //To remove duplicates
  let uniqueBlogs = result.reduce((distinctBlogs, blog) => {
    return distinctBlogs.findIndex(el => el.id === blog.id) === -1
      ? [...distinctBlogs, blog]
      : distinctBlogs;
  }, []);

  res.send(uniqueBlogs);
});

const deleteBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new CustomError('No blog Found!', 404);

  res.status(200).send('Deleted');
});

module.exports = { getBlogs, addBlog, updateBlog, searchBlog, deleteBlog };
