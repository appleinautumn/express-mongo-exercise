const bcrypt = require('bcrypt')
const createError = require('http-errors')

const User = require('./user.model')

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find()

    res.json({
      data: users,
    })
  } catch (e) {
    next(e)
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params

    let user
    try {
      user = await User.findById(id).orFail()
    } catch (e) {
      throw (createError(404))
    }

    res.json({
      data: user,
    })

  } catch (e) {
    next(e)
  }
}

exports.createUser = async (req, res, next) => {
  try {
    const { username, name, is_admin, password } = req.body

    const count = await User.countDocuments({ username: username })

    if (count > 0) {
      throw (createError(400, 'Username exists'))
    }

    // hash password
    const hash = await bcrypt.hash(password, 12)

    const user = await User.create({
      username,
      name,
      is_admin,
      password: hash,
      refresh_token: null,
      refresh_token_until: null,
    })

    res.json({
      data: user,
    })

  } catch (e) {
    next(e)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { username, name, is_admin, password } = req.body

    const count = await User.countDocuments({ username: username })

    if (count > 0) {
      throw (createError(400, 'Username exists'))
    }

    // hash password
    const hash = await bcrypt.hash(password, 12)

    let user
    try {
      user = await User.findById(id).orFail()
    } catch (e) {
      throw (createError(404))
    }

    user.username = username
    user.name = name
    user.is_admin = is_admin
    user.password = hash
    user.save()

    res.json({
      data: user,
    })

  } catch (e) {
    next(e)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndRemove(id);

    if (!user) {
      throw (createError(404))
    }

    res.json({
      data: user,
    })

  } catch (e) {
    next(e)
  }
}
