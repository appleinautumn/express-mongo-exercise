const bcrypt = require('bcrypt')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const User = require('./user.model')

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    // get user
    let user
    try {
      user = await User.findOne({ username }).orFail()
    } catch (e) {
      throw (createError(404))
    }

    // check password
    const validPassword = await validatePassword(password, user.password)

    if (!validPassword) {
      return next(createError(401, 'Invalid credentials.'))
    }

    const accessToken = jwt.sign({
      id: user._id,
      username: user.username,
      is_admin: user.is_admin,
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
    })

    res.json({
      "data": {
        "token": accessToken
      }
    })
  } catch (e) {
    next(e)
  }
}

function validatePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash)
}
