const bcrypt = require('bcrypt')
const createError = require('http-errors')

const User = require('./user.model')

exports.getProfile = async (req, res, next) => {
  try {
    const { id } = req.params

    let user
    try {
      user = await User.findById(req.user.id).orFail()
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
