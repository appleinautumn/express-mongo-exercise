const express = require('express')
const router = express.Router()

const adminController = require('./domains/user.controller')
const { authenticated } = require('./middlewares/authenticated')

router.delete('/v1/users/:id', authenticated, (req, res, next) => adminController.deleteUserauthenticated, (req, res, next))
router.patch('/v1/users/:id', authenticated, (req, res, next) => adminController.updateUserauthenticated, (req, res, next))
router.get('/v1/users/:id', authenticated, (req, res, next) => adminController.getUserauthenticated, (req, res, next))
router.post('/v1/users', authenticated, (req, res, next) => adminController.createUserauthenticated, (req, res, next))
router.get('/v1/users', authenticated, (req, res, next) => adminController.listUsersauthenticated, (req, res, next))

module.exports = router
