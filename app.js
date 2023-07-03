require('dotenv').config();

const cors = require('cors');
const express = require('express');
const createError = require('http-errors');

const router = require('./routes');

//  setup database connection
require('./db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', cors());
app.use('/api', router);

//  error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      code: err.status || 500,
      message: err.message,
      errors: err.errors,
    },
  });
});

module.exports = app;
