'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { NotFoundError } = require('./expressError');
const { authenticateJWT } = require('./middleware/auth');

const gameRoutes = require('./routes/games');
const apiRoutes = require('./routes/api');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'POST, GET, DELETE, PUT, PATCH',
  allowedHeaders: 'Content-Type, Authorization',
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('tiny'));
app.use(authenticateJWT);
app.use(express.urlencoded());

app.use('/', homeRoutes);
app.use('/users', usersRoutes);
app.use('/games', gameRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.use(function (req, res) { throw new NotFoundError(); });

app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== 'test') console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});

module.exports = app;