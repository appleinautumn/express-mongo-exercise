require('dotenv').config();

const cors = require('cors');
const express = require('express');
const createError = require('http-errors');

const router = require('./routes');

// Skip database connection in test environment
if (process.env.NODE_ENV !== 'test') {
  require('./db');
}

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, 'Resource Not Found'));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error message
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    code: err.code,
    name: err.name,
    message: err.message,
    data: err.data,
  });
});

module.exports = app;