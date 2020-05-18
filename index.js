require('dotenv').config();
require('./db');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const { port } = require('./config');

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const CustomError = require('./utils/CustomError');
const errorHandler = require('./controllers/error');

app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(cors());
app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.all('*', (req, res, next) => {
  next(new CustomError('Path not found!'), 404);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running `);
});
