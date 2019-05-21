const User = require('../models/User')

class UserController {
  async index (req, res) {
    const users = await User.paginate(
      {},
      {
        page: req.query.page || 1,
        limit: 20,
        sort: '-createdAt'
      }
    )
    return res.json(users)
  }

  async store (req, res) {
    const { email } = req.body

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = await User.create(req.body)

    return res.json(user)
  }
}

module.exports = new UserController()
