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
