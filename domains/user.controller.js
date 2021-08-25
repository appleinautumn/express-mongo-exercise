const bcrypt = require('bcrypt')

const User = require('./user.model')

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find()

    res.json({
      data: users,
    })
  } catch (e) {
    throw e
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)

    res.json({
      data: user,
    })

  } catch (e) {
    throw e
  }
}

exports.createUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { username, name, is_admin, password } = req.body

    // hash password
    const hash = await bcrypt.hash(password, 12)

    const user = new User({
      username,
      name,
      is_admin,
      password: hash,
    })
    await user.save()

    res.json({
      data: user,
    })

  } catch (e) {
    throw e
  }
}
