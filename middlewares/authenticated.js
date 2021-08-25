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
        id: decoded.id,
        username: decoded.username,
      }

      return next()
    })

  } catch (error) {
    next(error)
  }
}
