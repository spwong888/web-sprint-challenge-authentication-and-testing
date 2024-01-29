const router = require('express').Router();
const middleware = require('./middleware');
const helper = require('./helper');
const model = require('./model');


router.post('/register', middleware.validateBody, async (req, res) => {
  const hashedPassword = await helper.hashPassword(req.body.password);
  try {
    const insertedUser = await model.insert({
      username: req.body.username,
      password: hashedPassword
    });
    return res.send(insertedUser);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).send('username taken');
    }
    return res.sendStatus(400);
  }
});

router.post('/login', middleware.validateBody, async (req, res) => {
  const dbUser = await model.getByUsername(req.body.username);

  if (!dbUser) {
    return res.status(401).send('invalid credentials');
  }

  const isPasswordValid = await helper.isPasswordValid(req.body.password, dbUser.password);

  if (!isPasswordValid) {
    return res.status(401).send('invalid credentials');
  }

  const jwt = await helper.makeJwt({
    username: dbUser.username,
    id: dbUser.id
  });

  return res.send({
    message: `welcome, ${dbUser.username}`,
    token: jwt
  });
});

module.exports = router;