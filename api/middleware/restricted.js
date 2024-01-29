const helper = require('../auth/helper');

module.exports = async (req, res, next) => {

  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).send('token required')
  }

  try {
    await helper.verifyJwt(authToken);
  } catch (err) {
    return res.status(401).send('token invalid')
  }
  next();
};