const Blog = require('../models/Blog');

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
      .limit(limit);
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
module.exports = { getBlogs, addBlog, updateBlog };
