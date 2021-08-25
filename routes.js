const express = require('express')
const router = express.Router()

const userController = require('./domains/user.controller')

router.patch('/v1/users/:id', (req, res, next) => userController.updateUser(req, res, next))
router.get('/v1/users/:id', (req, res, next) => userController.getUser(req, res, next))
router.post('/v1/users', (req, res, next) => userController.createUser(req, res, next))
router.get('/v1/users', (req, res, next) => userController.listUsers(req, res, next))

module.exports = router
