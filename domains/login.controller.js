const bcrypt = require('bcrypt')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const { DateTime } = require('luxon')
const { nanoid } = require('nanoid')

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

    // generate new refresh token
    user.refresh_token = nanoid(10)
    user.refresh_token_until = DateTime.local().plus({ days: 30 })
    user.save()

    const token = jwt.sign({
      sub: user._id,
      is_admin: user.is_admin,
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
    })

    res.json({
      data: {
        token,
      }
    })
  } catch (e) {
    next(e)
  }
}

exports.refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body

    const { authorization } = req.headers

    if (!authorization) {
      throw createError(401, 'Invalid Token.')
    }

    // decode jwt while ignoring expiration
    const jwtData = decodeTokenIgnoringExpiration(authorization)
    const userId = jwtData.sub

    // get user
    let user
    try {
      user = await User.findById(userId).orFail()
    } catch (e) {
      throw (createError(404))
    }

    // if refresh token does not exist
    if (!user.refresh_token) {
      throw createError(401, 'Invalid Refresh Token.')
    }

    // if refresh token is not the same with the stored one
    if (user.refresh_token !== refresh_token) {
      throw createError(401, 'Invalid Refresh Token.')
    }

    // if stored refresh token has expired
    if (isRefreshTokenExpired(user.refresh_token_until)) {
      throw createError(401, 'Expired Refresh Token.')
    }

    // create access token
    const token = jwt.sign({
      id: user._id,
      is_admin: user.is_admin,
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
    })

    res.json({
      data: {
        token,
      }
    })
  } catch (e) {
    next(e)
  }
}

function validatePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash)
}

function decodeTokenIgnoringExpiration(authorizationHeaderString) {
  try {
    // get token
    const token = authorizationHeaderString.split(' ')[1]
    if (!token) {
      throw createError(401, 'Invalid token.')
    }

    return jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true })

  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      throw createError(401, e.message)
    }
    throw (e)
  }
}

function isRefreshTokenExpired(tokenTime) {
  const tokenExpiry = DateTime.fromJSDate(tokenTime)
  const now = new Date()

  // true if expired
  return now.getTime() > tokenExpiry.toMillis()
}
