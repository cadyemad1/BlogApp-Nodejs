const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const { promisify } = require('util');
var jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../config');
var omit = require('lodash.omit');

const signJWT = promisify(jwt.sign);
const verifyJWT = promisify(jwt.verify);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'You must have a username']
    },
    password: {
      type: String,
      required: [true, 'You must have a password']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'You must have an email']
    },
    followingList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => omit(ret, ['__v', 'createdAt'])
    }
  }
);
userSchema.index({ username: 'text' });

userSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'author'
});

userSchema.pre('save', async function(next) {
  if (this.password || this.isModified(password)) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});

userSchema.methods.checkPassword = function(userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

userSchema.methods.generateToken = function() {
  return signJWT({ _id: this._id }, jwtSecretKey, { expiresIn: '30min' });
};

userSchema.statics.verifyToken = async function(token) {
  return await verifyJWT(token, jwtSecretKey);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
