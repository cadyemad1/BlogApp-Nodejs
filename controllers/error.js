const { nodeEnv } = require('../config');
const CustomError = require('../utils/CustomError');

const handleDuplicate = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `User Already Exists`;
  return new CustomError(message, 400);
};
const handleJWTError = () =>
  new CustomError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new CustomError('Your token has expired! Please log in again.', 401);

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err
  });
};

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.log('Prod Error->', err);
    res.status(500).json({
      message: 'Something Went Wrong!'
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (nodeEnv === 'development') sendErrDev(err, res);
  else {
    let error = { ...err };
    error.message = err.message;
    if (error.code === 11000) error = handleDuplicate(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrProd(error, res);
  }
};
