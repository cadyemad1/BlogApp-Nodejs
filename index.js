require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db');
const app = express();
const hostname = '127.0.0.1';
const { port } = require('./config');

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const CustomError = require('./utils/CustomError');
const errorHandler = require('./controllers/error');

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.all('*', (req, res, next) => {
  next(new CustomError('Path not found!'), 404);
});

app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
