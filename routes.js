const express = require('express')
const router = express.Router()

const userController = require('./domains/user.controller')

router.get('/v1/users', (req, res, next) => userController.listUsers(req, res, next))

module.exports = router
