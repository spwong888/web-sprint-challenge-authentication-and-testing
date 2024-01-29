const { findByUserName } = require('../auth/auth-model')

const checkCredentials = (req, res, next) => {
  let creds = req.body
  if (!creds.username || !creds.password) {
    res.status(400).json({message: 'username and password required'})
  }
  findByUserName(req.body.username)
  .then((user) => {
    if (!user) {
      next()
    } else {
      res.status(401).json('username taken')
    }
  })
  .catch(next)
}

const checkUserExists = (req, res, next) => {
  let creds = req.body
  if (!creds.username || !creds.password) {
    res.status(400).json({message: 'username and password required'})
  }
  findByUserName(req.body.username)
    .then((user) => {
      if (user) {
        req.body.user = user
        next()
      } else {
        res.status(401).json('invalid credentials')
      }
    })
    .catch(next)
}
module.exports = {
  checkCredentials,
  checkUserExists
}