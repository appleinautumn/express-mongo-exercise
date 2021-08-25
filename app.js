require('dotenv').config()

const cors = require('cors')
const express = require('express')
const createError = require('http-errors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const router = require('./routes')
app.use('/api', cors())

app.use('/api', router)

const mongoose = require('mongoose')

const mongoDB = 'mongodb://127.0.0.1/sejutacita'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

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
