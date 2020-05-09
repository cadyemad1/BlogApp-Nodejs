const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const { _id } = await User.verifyToken(authorization);
    const user = await User.findById(_id);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
