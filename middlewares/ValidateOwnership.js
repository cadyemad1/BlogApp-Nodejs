const Blog = require('../models/Blog');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.user;
    const blog = await Blog.findById(req.params.id).populate({
      path: 'author',
      select: 'id'
    });
    if (id !== blog.author.id) throw new Error('No access to modify blog');
    req.blog = blog;
    next();
  } catch (err) {
    next(err);
  }
};
