const { JWT_SECRET } = require('../secrets')
const jwt = require('jsonwebtoken')

function tokenBuilder(user) {
  const payload = {
    subject: user.id,
    username: user.username,

  }
  const config = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, JWT_SECRET, config)
}

module.exports = {
  tokenBuilder
}