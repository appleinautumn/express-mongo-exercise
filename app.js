const express = require('express')
const createError = require('http-errors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const indexRouter = require('./routes')

app.use('/', indexRouter)


module.exports = app
