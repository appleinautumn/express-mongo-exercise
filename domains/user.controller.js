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
