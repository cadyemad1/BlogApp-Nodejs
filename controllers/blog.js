const Blog = require('../models/Blog');
const User = require('../models/User');

const getBlogs = async (req, res) => {
  try {
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
        throw new Error();
      }
    }
    res.send(blogs);
  } catch (err) {
    res.status(404).send('Blogs not found');
  }
};

const addBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(200).json({ message: 'blog was added successfully' });
  } catch (err) {
    console.log('ERRORZZ', err);
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
      useFindAndModify: false
    });
    res
      .status(200)
      .json({ message: 'Blog was edited successfully', updatedBlog });
  } catch (err) {
    res.status(404).send('Not available');
  }
};

const searchBlog = async (req, res) => {
  try {
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
  } catch (err) {
    console.log('**', err);

    res.status(404).send('Blogs not found');
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.status(200).send('Deleted');
  } catch (err) {
    console.log('ERRORZZ', err);
  }
};

module.exports = { getBlogs, addBlog, updateBlog, searchBlog, deleteBlog };
