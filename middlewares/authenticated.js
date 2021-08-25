const createError = require('http-errors')
const jwt = require('jsonwebtoken')

exports.authenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
      return next(createError(401, 'Invalid credentials.'))
    }

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return next(createError(401, 'Failed to authenticate token.'))
      }

      req.user = {
        id: decoded.sub,
        is_admin: decoded.is_admin,
      }

      return next()
    })

  } catch (e) {
    next(e)
  }
}

exports.isAdmin = (req, res, next) => {
  if (req.user.is_admin) {
    return next()
  }
  throw createError(403, 'Forbidden.')
}
