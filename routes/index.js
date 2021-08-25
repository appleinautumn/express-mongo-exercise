const express = require('express')
const router = express.Router()

const adminController = require('../domains/admin.controller')
const loginController = require('../domains/login.controller')
const userController = require('../domains/user.controller')
const { authenticated } = require('../middlewares/authenticated')

router.delete('/admin/v1/users/:id', authenticated, (req, res, next) => adminController.deleteUser(req, res, next))
router.patch('/admin/v1/users/:id', authenticated, (req, res, next) => adminController.updateUser(req, res, next))
router.get('/admin/v1/users/:id', authenticated, (req, res, next) => adminController.getUser(req, res, next))
router.post('/admin/v1/users', authenticated, (req, res, next) => adminController.createUser(req, res, next))
router.get('/admin/v1/users', authenticated, (req, res, next) => adminController.listUsers(req, res, next))

router.get('/v1/profile', authenticated, (req, res, next) => userController.getProfile(req, res, next))

router.post('/v1/logins', (req, res, next) => loginController.login(req, res, next))

module.exports = router
