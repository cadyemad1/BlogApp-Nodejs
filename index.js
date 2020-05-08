require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db');
const app = express();
const hostname = '127.0.0.1';
const { port } = require('./config');

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');

app.use(express.json());
app.use(cors());
app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
