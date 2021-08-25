const express = require('express')
const createError = require('http-errors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const indexRouter = require('./routes')

app.use('/', indexRouter)

//  error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.json({
    error: {
      code: err.status || 500,
      message: err.message,
      errors: err.errors,
    }
  })
})

module.exports = app
